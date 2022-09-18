const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        userId: {type:String, required: true} ,
        photoURL: {type: String},
        content: {type:String, required:true},
        likes: {type:Number, required:true},
    },
    {
        versionKey: false,
    }
)


const comments = mongoose.model("comments", commentSchema);

module.exports = comments;