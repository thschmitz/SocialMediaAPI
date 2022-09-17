const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const posts = require("../models/Post");
const users = require("../models/User")
const getTokenFromHeaders = require("../utils/getTokenFromHeaders");

require("dotenv").config();

const checkSession = async (req, res) => {
    const token = getTokenFromHeaders(req);
    if(!token) return res.status(401).json({ error: { status: 401, message: 'You don\'t have credentials' } });
    const decodedToken = await jwt.decode(token);

    try {
      users.findOne({ _id: decodedToken.sub }, function (err, user) {
        if (err || user === null) {
          res.status(500).send({message: "You don't have the necessary credentials to do this action!"})
          return null;
        } else {
          return user;
        }
      });
    } catch(err) {
      res.status(500).send({message: "You don't have the necessary credentials to do this action!"})
      return null;
    }
}

const createPosts = async (req, res) => {
    const post = new posts(req.body);
    const session = await checkSession(req, res)
    if(session !== null){
      post.save((err) => {
        if(err) {
            res.status(500).send({message: "Error trying to create the post! - " + err})
        } else {
            res.status(200).send({message: "Success! The post was created!"})
        }
      })
    }


}

const editPosts = (req, res) => {
    const id = req.body._id;
    const session = checkSession(req, res)

    if(session !== null) {
      posts.updateOne({_id: id}, {$set: {title: req.body.title, photoURL: req.body.photoURL, likes: req.body.likes, conteudo: req.body.conteudo, userId: req.body.userId}}, function(err, res) {
        if(err){
            res.status(500).send({message: "Error while editing post! " + err})
        }

      })
    }


    res.status(200).send({message: "Successfull edit"})
}

const deletePosts = (req, res) => {
    const id = req.body._id;
    const session = checkSession(req, res)

    if(session !== null){
      posts.deleteOne({_id: id}, function(err, post){
          if(err) {
              res.status(500).send({message: "Error while deleting post! " + err})
          }
      })
    }

    res.status(200).send({message: "Successfull Delete!"})
}

const getPosts = (req, res) => {
    checkSession(req, res)

    posts.find((err, post) => {
        res.status(200).send(post)
    })
}


module.exports = {getPosts, createPosts, editPosts, deletePosts};