const express = require("express");

const {getUsers, signup, login, getUserbyId} = require("../controllers/auth")

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/users", getUsers);
router.get("/users/id", getUserbyId)

module.exports = router;