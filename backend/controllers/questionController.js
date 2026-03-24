const supabase = require("../utils/supabase");
const askAI = require("../services/aiService");

exports.askQuestion = async (req, res) => {
    try {

        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ error: "Question is required" });
        }

        const answer = await askAI(question);

        const { data, error } = await supabase
        .from("ai_questions")
        .insert([
            {
                user_id: req.user?.id || null,
                question: question,
                answer: answer,
                chat_id: crypto.randomUUID()
            }
        ])
        .select();

        console.log("INSERT DATA:", data);
        console.log("INSERT ERROR:", error);

        res.json({
            success: true,
            question,
            answer
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "AI processing failed"});
    } 
};



exports.createQuestion = async (req, res) => {
    try {
        const { title, question, reward, user_id } = req.body;

        const { data, error } = await supabase
        .from("ai_questions")
        .insert([{ title, question, reward, user_id }]);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.json({
            message: "Question created successfully",
            question: data
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.getQuestions = async (req, res) => {
    try {
        const { data, error } = await supabase
        .from("questions")
        .select("*")
        .order("created_at", { ascending: false})

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.json(data)
    } catch (err) {
        res.status(500).json({ error: "Server error"});
    }
};


exports.solveQuestion = async (req, res) => {
    try {
        const { question } = req.body;
        
        const prompt = `
        Answer this study question clearly and simply.
        
        Question: ${question}
        `;

        const response = await askAI(prompt);

        const { chatId } = req.body

        try {
        await supabase
        .from("ai_questions")
        .insert([
            {
                user_id: req.user.id,
                chat_id: chatId,
                question: question,
                answer: response
            }
        ]);

    } catch (dbError) {
        console.log("Database save failed", dbError)
    }

        res.json({
            result: response
        });
    } catch (rror) {
        res.status(500).json({ error: error.message });
    }
};

exports.getHistory = async (req, res) => {

    const { data } = await supabase
    .from("ai_questions")
    .select("*")
    .order("created_at", { ascending: false})

    res.json(data)
}