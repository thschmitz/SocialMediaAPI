const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        title: {type: String, required:true},
        photoURL: {type: String, required:false},
        likes: {type: Number, required:true},
        conteudo: {type: String, required:true, unique:true},
        userId: {type:String, required:true, unique:true},
    },
    {
        versionKey: false,
    }
)


const posts = mongoose.model("posts", postSchema);

module.exports = posts;