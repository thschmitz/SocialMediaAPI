const express = require("express");

const {getUsers, signup, login} = require("../controllers/auth")

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/users", getUsers);

module.exports = router;