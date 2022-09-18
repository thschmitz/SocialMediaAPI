const express = require("express");
const cors = require("cors");
const db = require("./src/config/dbConnect");

const authRoutes = require("./src/routes/auth");
const postRoutes = require("./src/routes/post");
const commentRoutes = require("./src/routes/comment")
const app = express();
const port = process.env.PORT || 3000;

require("dotenv").config();

db.once("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Connected to MongoDB")
})

const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }

app.use(cors(corsOptions));
app.use(express.json());
app.use("/", authRoutes)
app.use("/", postRoutes)
app.use("/", commentRoutes)
app.get("/", (req, res) => {
    res.send("Hello World")
})

app.listen(port, () => console.log(`Server running on port ${port}`))