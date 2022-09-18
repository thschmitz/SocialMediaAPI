const jwt = require("jsonwebtoken");
const comments = require("../models/Comment");
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

const createComment = async (req, res) => {
    const comment = new comments(req.body);
    const session = await checkSession(req, res)
    if(session !== null){
      comment.save((err) => {
        if(err) {
            res.status(500).send({message: "Error trying to create the comment! - " + err})
        } else {
            res.status(200).send({message: "Success! The comment was created!"})
        }
      })
    }


}

const editComment = (req, res) => {
    const id = req.body._id;
    const session = checkSession(req, res)

    if(session !== null) {
      comments.updateOne({_id: id}, {$set: {title: req.body.title, photoURL: req.body.photoURL, likes: req.body.likes, conteudo: req.body.conteudo, userId: req.body.userId}}, function(err, res) {
        if(err){
            res.status(500).send({message: "Error while editing comment! " + err})
        } else {
            res.status(200).send({message: "Successfull edit"})
        }
      })
    }

}

const deleteComment = (req, res) => {
    const id = req.body._id;
    const session = checkSession(req, res)

    if(session !== null){
      comments.deleteOne({_id: id}, function(err, comment){
        if(err) {
            res.status(500).send({message: "Error while deleting comment! " + err})
        }else{
            res.status(200).send({message: "Successfull Delete!"})
        }
      })
    }

}

const getComments = (req, res) => {

    comments.find((err, comment) => {
        res.status(200).send(comment)
    })
}


module.exports = {getComments, createComment, editComment, deleteComment};