const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const Transaction = require("../models/Transaction");
const fraudCheck = require("../middleware/fraudCheck");
const protect = require("../middleware/auth");

// ── Apply auth middleware to ALL transaction routes ───
router.use(protect);

/**
 * POST /api/transactions
 * Submit a new transaction for fraud analysis.
 */
router.post("/", fraudCheck, async (req, res) => {
    try {
        const { amount, time, category } = req.body;
        const { isFraud, mlScore, aiReason } = req.fraudResult;

        const transaction = await Transaction.create({
            user: req.user.id,
            amount: parseFloat(amount),
            category: category || "misc_net",
            timestamp: new Date(),
            status: isFraud ? "Flagged" : "Approved",
            aiReason,
            mlScore,
        });

        // Emit real-time event via Socket.io
        const io = req.app.get("io");
        if (io) {
            io.emit("newTransaction", transaction);
        }

        res.status(201).json({
            success: true,
            data: transaction,
        });
    } catch (error) {
        console.error("❌ Transaction creation error:", error.message);
        res.status(500).json({
            success: false,
            error: "Failed to process transaction",
        });
    }
});

/**
 * GET /api/transactions
 * Retrieve recent transactions for the logged-in user, newest first.
 */
router.get("/", async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({
            success: true,
            count: transactions.length,
            data: transactions,
        });
    } catch (error) {
        console.error("❌ Fetch transactions error:", error.message);
        res.status(500).json({
            success: false,
            error: "Failed to fetch transactions",
        });
    }
});

/**
 * DELETE /api/transactions/:id
 * Delete a specific transaction by ID (only if it belongs to the user).
 */
router.delete("/:id", async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id,
        });
        if (!transaction) {
            return res.status(404).json({ success: false, error: "Transaction not found" });
        }

        // Emit real-time event via Socket.io
        const io = req.app.get("io");
        if (io) {
            io.emit("transactionDeleted", req.params.id);
        }

        res.json({ success: true, message: "Transaction deleted" });
    } catch (error) {
        console.error("❌ Delete transaction error:", error.message);
        res.status(500).json({ success: false, error: "Failed to delete transaction" });
    }
});

/**
 * GET /api/transactions/stats
 * Aggregated stats for analytics charts (scoped to current user).
 */
router.get("/stats", async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(200);

        // Status breakdown
        const approved = transactions.filter((t) => t.status === "Approved").length;
        const flagged = transactions.filter((t) => t.status === "Flagged").length;

        // Fraud by category
        const categoryMap = {};
        transactions.forEach((t) => {
            const cat = t.category || "unknown";
            if (!categoryMap[cat]) categoryMap[cat] = { total: 0, flagged: 0 };
            categoryMap[cat].total++;
            if (t.status === "Flagged") categoryMap[cat].flagged++;
        });
        const byCategory = Object.entries(categoryMap).map(([name, data]) => ({
            name: name.replace(/_/g, " "),
            total: data.total,
            flagged: data.flagged,
        }));

        // Volume by hour
        const hourMap = Array.from({ length: 24 }, (_, i) => ({ hour: `${i}:00`, approved: 0, flagged: 0 }));
        transactions.forEach((t) => {
            const h = new Date(t.timestamp || t.createdAt).getHours();
            if (t.status === "Flagged") hourMap[h].flagged++;
            else hourMap[h].approved++;
        });

        res.json({
            success: true,
            data: { approved, flagged, total: transactions.length, byCategory, byHour: hourMap },
        });
    } catch (error) {
        console.error("❌ Stats error:", error.message);
        res.status(500).json({ success: false, error: "Failed to fetch stats" });
    }
});

/**
 * GET /api/transactions/report
 * Generate and download a PDF report (scoped to current user).
 * Supports selective export via ?ids=id1,id2,...
 */
router.get("/report", async (req, res) => {
    try {
        let transactions;
        const { ids } = req.query;

        if (ids) {
            // Selective: only include specified transaction IDs belonging to this user
            const idList = ids.split(",").map((id) => id.trim()).filter(Boolean);
            transactions = await Transaction.find({ _id: { $in: idList }, user: req.user.id }).sort({ createdAt: -1 });
        } else {
            // All transactions for this user
            transactions = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(100);
        }

        const doc = new PDFDocument({ margin: 40, size: "A4" });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=FraudGuard_Report.pdf");
        doc.pipe(res);

        // ── Title ──────────────────────────────────────
        doc.fontSize(22).font("Helvetica-Bold").text("FraudGuard Mini", { align: "center" });
        doc.fontSize(11).font("Helvetica").fillColor("#666")
            .text("Transaction Fraud Analysis Report", { align: "center" });
        doc.moveDown(0.3);
        doc.fontSize(9).text(`Generated: ${new Date().toLocaleString()}`, { align: "center" });
        if (ids) {
            doc.fontSize(9).fillColor("#6366f1").text(`Selected Transactions: ${transactions.length}`, { align: "center" });
        }
        doc.moveDown(1);

        // ── Summary ────────────────────────────────────
        const approved = transactions.filter((t) => t.status === "Approved").length;
        const flagged = transactions.filter((t) => t.status === "Flagged").length;

        doc.fontSize(13).font("Helvetica-Bold").fillColor("#000").text("Summary");
        doc.moveDown(0.3);
        doc.fontSize(10).font("Helvetica").fillColor("#333");
        doc.text(`Total Transactions: ${transactions.length}`);
        doc.text(`Approved: ${approved}`, { continued: true }).text(`    |    Flagged: ${flagged}`);
        doc.moveDown(1);

        // ── Table Header ───────────────────────────────
        doc.fontSize(12).font("Helvetica-Bold").fillColor("#000").text("Transaction Details");
        doc.moveDown(0.5);

        const tableTop = doc.y;
        const col = { amount: 40, category: 120, status: 240, score: 320, date: 400 };

        doc.fontSize(8).font("Helvetica-Bold").fillColor("#444");
        doc.text("Amount", col.amount, tableTop);
        doc.text("Category", col.category, tableTop);
        doc.text("Status", col.status, tableTop);
        doc.text("ML Score", col.score, tableTop);
        doc.text("Date", col.date, tableTop);

        doc.moveTo(40, tableTop + 14).lineTo(555, tableTop + 14).strokeColor("#ddd").stroke();
        doc.moveDown(0.8);

        // ── Table Rows ─────────────────────────────────
        doc.font("Helvetica").fontSize(8);

        transactions.forEach((txn) => {
            if (doc.y > 700) {
                doc.addPage();
            }

            const y = doc.y;
            const statusColor = txn.status === "Flagged" ? "#dc2626" : "#059669";

            doc.fillColor("#333").text(`$${txn.amount.toFixed(2)}`, col.amount, y);
            doc.text((txn.category || "N/A").replace(/_/g, " "), col.category, y);
            doc.fillColor(statusColor).text(txn.status, col.status, y);
            doc.fillColor("#333").text(txn.mlScore?.toFixed(4) || "N/A", col.score, y);
            doc.text(
                new Date(txn.createdAt || txn.timestamp).toLocaleDateString(),
                col.date,
                y
            );

            if (txn.aiReason && txn.status === "Flagged") {
                doc.moveDown(0.3);
                doc.fontSize(7).fillColor("#b91c1c").text(`AI: ${txn.aiReason}`, 50, doc.y, {
                    width: 490,
                });
                doc.fontSize(8);
            }

            doc.moveDown(0.5);
        });

        // ── Footer ─────────────────────────────────────
        doc.moveDown(1);
        doc.fontSize(8).fillColor("#999")
            .text("FraudGuard Mini · IsolationForest + Gemini 2.0 Flash · Auto-generated report", {
                align: "center",
            });

        doc.end();
    } catch (error) {
        console.error("❌ Report generation error:", error.message);
        res.status(500).json({ success: false, error: "Failed to generate report" });
    }
});

module.exports = router;
