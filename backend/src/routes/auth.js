const express = require("express");

const UserController = require("../controllers/auth")

const router = express.Router();

router
    .get("/api/session", UserController.session)
    .get("/api/:id", UserController.listarUserPorId)
    .get("/api/busca", UserController.listarUserPorNome)
    .get("/api", UserController.listarUser)
    .post("/api/login", UserController.signIn)
    .post("/api/refresh", UserController.refreshTokens)
    .post("/api", UserController.cadastrarUser)
    .put("/api/:id", UserController.atualizarUser)
    .delete("/api/:id", UserController.deletarUserPorId)

module.exports = router;