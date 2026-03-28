const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Fraud-check middleware.
 * 1. Calls the Python ML service to get a fraud prediction.
 * 2. If flagged, calls Gemini API for a human-readable explanation.
 * 3. Attaches { isFraud, mlScore, aiReason } to req.fraudResult.
 */
const fraudCheck = async (req, res, next) => {
    try {
        const { amount, time, category } = req.body;

        // ── Step 1: Call Python ML service ──────────────────
        const mlUrl = process.env.ML_SERVICE_URL || "http://localhost:5001";
        const mlResponse = await axios.post(`${mlUrl}/predict`, {
            amount: parseFloat(amount),
            time: parseInt(time, 10),
            category: category || "",
        });

        const { isFraud, score } = mlResponse.data;

        let aiReason = "";

        // ── Step 2: If fraud detected, call Gemini for explanation
        if (isFraud) {
            try {
                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

                const prompt = `You are a fraud detection analyst. A transaction has been flagged as potentially fraudulent by our ML model. Here are the details:

- Amount: $${amount}
- Time of transaction: ${time}:00 hours (24-hour format)
- ML Anomaly Score: ${score}

Please provide a brief, human-readable explanation (2-3 sentences) of why this transaction might be risky. Consider factors like unusual transaction amounts, odd timing, and statistical anomaly scores.`;

                const result = await model.generateContent(prompt);
                aiReason = result.response.text();
            } catch (geminiError) {
                console.error("⚠️  Gemini API error:", geminiError.message);
                aiReason = `Transaction flagged by ML model with anomaly score ${score}. Gemini analysis unavailable.`;
            }
        }

        // ── Attach result to request ───────────────────────
        req.fraudResult = {
            isFraud,
            mlScore: score,
            aiReason,
        };

        next();
    } catch (error) {
        console.error("❌ Fraud check error:", error.message);

        // If ML service is down, let the transaction through as Approved
        req.fraudResult = {
            isFraud: false,
            mlScore: 0,
            aiReason: "",
        };
        next();
    }
};

module.exports = fraudCheck;
