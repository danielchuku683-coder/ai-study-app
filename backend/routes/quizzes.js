const express = require("express");
const router = express.Router();

const { generateQuiz } = require("../controllers/quizzesController");

router.post("/generate", generateQuiz);

module.exports = router