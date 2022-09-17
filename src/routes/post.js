const express = require("express");

const {getPosts, createPosts, editPosts, deletePosts} = require("../controllers/post")

const router = express.Router();

router.get("/posts", getPosts);
router.post("/posts", createPosts)
router.put("/posts", editPosts)
router.delete("/posts", deletePosts)


module.exports = router;