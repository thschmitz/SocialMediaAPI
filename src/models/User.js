const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        image: {type: String},
        username: {type: String, required: true, unique:true},
        nome: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        senha: {type: String, required: true}
    },
    {
        versionKey: false,
    }
)


const users = mongoose.model("users", userSchema);

module.exports = users;