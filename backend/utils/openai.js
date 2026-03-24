const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function askAI(question) {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash"
    });

    const result = await model.generateContent(question);

    return result.response.text();
}

module.exports = askAI;