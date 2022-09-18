const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://thschmitz:thomas05@cluster0.2vxlcng.mongodb.net/?retryWrites=true&w=majority")

let db = mongoose.connection;

module.exports = db