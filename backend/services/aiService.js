const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function askAI(prompt) {
try {
// Change it to this:
const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-1.5-flash" });

const result = await model.generateContent(prompt);

const response = result.response;

return response.text();

} catch (error) {
console.error("AI FULL ERROR:", error);
return "AI could not generate a response.";
}
}

module.exports = askAI;



//async function askAI(prompt) {
    //Temporary fake AI response
  //  return ".Key concept ecplained\n. Important idea summarized\n. Main takeaway from the notes";
//}

//module.exports = askAI