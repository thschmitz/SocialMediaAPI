const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const posts = require("../models/Post");

require("dotenv").config();
const salt = bcrypt.genSaltSync(10)

const createPosts = (req, res) => {
    const post = new posts(req.body);

    post.save((err) => {
        if(err) {
            res.status(500).send({message: "Error trying to create the post! - " + err})
        } else {
            res.status(200).send({message: "Success! The post was created!"})
        }
    })
}

const getPosts = (req, res) => {
    posts.find((err, post) => {
        res.status(200).send(post)
    })
}


module.exports = {getPosts, createPosts};