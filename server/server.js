const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const transactionRoutes = require("./routes/transactions");
const authRoutes = require("./routes/auth");

// ── Load environment variables ─────────────────────────
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Create HTTP server + Socket.io ─────────────────────
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
});

// Make io accessible in routes via req.app.get("io")
app.set("io", io);

// ── Middleware ──────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ─────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "FraudGuard Mini API",
        version: "2.0.0",
        endpoints: {
            "POST   /api/transactions": "Submit a transaction for fraud analysis",
            "GET    /api/transactions": "Retrieve recent transactions",
            "DELETE /api/transactions/:id": "Delete a transaction",
            "GET    /api/transactions/stats": "Aggregated analytics data",
            "GET    /api/transactions/report": "Download PDF report (?ids=id1,id2 for selective)",
        },
    });
});

// ── Socket.io connection ───────────────────────────────
io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);
    socket.on("disconnect", () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
    });
});

// ── Start server ───────────────────────────────────────
const startServer = async () => {
    await connectDB();
    server.listen(PORT, () => {
        console.log(`🚀 FraudGuard server running on http://localhost:${PORT}`);
        console.log(`🔌 Socket.io ready`);
    });
};

startServer();
