const express = require("express");
const router = express.Router();

const questionController = require("../controllers/questionController")
const { createQuestion, getQuestions, solveQuestion, getHistory} = require("../controllers/questionController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create", createQuestion);
router.get("/", getQuestions);
router.post("/ask", authMiddleware, solveQuestion);
router.get("/history", authMiddleware, getHistory)
module.exports = router;