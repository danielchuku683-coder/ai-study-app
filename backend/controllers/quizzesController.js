const askAI = require("../services/aiService");

exports.generateQuiz = async (req, res) => {
    try {
    const { notes } = req.body;
    
    if (!notes) {
        return res.status(400).json({
            error: "Notes are required to generate a quiz"
        });
    }

    const prompt = `
    Generate a short quiz from these notes.
    
    Create:
    - 3 multiple choice questions
    - Each question should have 4 options
    - Mark the correct answer
    
    Notes:
    ${notes}
    `;

    const quiz = await askAI(prompt);

    res.json({
        success: true,
        quiz
    });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Quiz generation failed"
        })
    }
}