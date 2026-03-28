require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
    console.log("🔑 API Key:", process.env.GEMINI_API_KEY ? "Found (" + process.env.GEMINI_API_KEY.substring(0, 8) + "...)" : "❌ NOT FOUND");

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        console.log("\n⏳ Calling Gemini API...");
        const result = await model.generateContent("Say hello in one sentence.");
        const text = result.response.text();

        console.log("✅ Gemini API is working!");
        console.log("📝 Response:", text);
    } catch (error) {
        console.log("❌ Gemini API Error:", error.message);
    }
}

testGemini();
