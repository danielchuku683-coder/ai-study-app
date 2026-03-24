require("dotenv").config();

const express = require("express");
const cors = require("cors");
require("dotenv").config();

console.log("API KEY:", process.env.GEMINI_API_KEY);
console.log("JWT SECRET:", process.env.JWT_SECRET);
const authRoutes = require("./routes/auth");
const questionsRoutes = require("./routes/questions");
const noteRouters = require("./routes/notes");
const quizRoutes = require("./routes/quizzes")
const chatRouter = require("./routes/chats")
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai_questions", questionsRoutes);
app.use("/api/notes", noteRouters);
app.use("/api/quizzes", quizRoutes);
app.use("/api/chats", chatRouter)
// test route
app.get("/", (req, res) => {
    res.send("AI Study Assistant Backend Runing")
});

app.get("/api/ai_questions/history", (req, res) => {
    res.json([]);
});


app.listen(5000, () => {
console.log("Server running on 5000");
});