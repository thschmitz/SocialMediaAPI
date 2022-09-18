const express = require("express");

const {getComments, createComment, editComment, deleteComment} = require("../controllers/comment")

const router = express.Router();

router.get("/comments", getComments);
router.post("/comment", createComment)
router.put("/comment", editComment)
router.delete("/comment", deleteComment)


module.exports = router;