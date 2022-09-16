const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        nome: {type: String, required: true},
        email: {type: String, required: true},
        senha: {type: String, required: true}
    },
    {
        versionKey: false,
    }
)


const users = mongoose.model("users", userSchema);

module.exports = users;