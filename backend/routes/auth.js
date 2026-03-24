const express = require("express");
const router = express.Router();

const { register, login, deleteAccount } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.delete("/delete", deleteAccount)
router.get("/", (req, res) => {
    res.send("Auth route working");
});

module.exports = router;