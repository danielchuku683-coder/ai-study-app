const express = require("express");
const router = express.Router();
const { summarizeNotes } = require("../controllers/notesController");

router.post("/summarize", summarizeNotes);

module.exports = router;