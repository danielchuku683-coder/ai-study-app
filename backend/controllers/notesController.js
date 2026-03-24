const askAI = require("../services/aiService");

exports.summarizeNotes = async (req, res) => {
    try {

        const { notes } = req.body;

        if (!notes) {
            return res.status(400).json({ error: "Note are required" });
        } 

        const prompt = `
        Summarize these study notes in simple bullet points.
        
        Notes:
        ${notes}
        `;

        const summary = await askAI(prompt);

        res.json({
            success: true,
            summary
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "AI summarization faild"
        });
    }
};