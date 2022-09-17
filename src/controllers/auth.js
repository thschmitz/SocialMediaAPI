const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = require("../models/User");

require("dotenv").config();
const salt = bcrypt.genSaltSync(10)

function createAccessToken(user) {
    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, process.env.CHAVE_JWT, {subject: `${user._id}`})
    return token;
}


const signup = (req, res) => {
    let senhaCripto = bcrypt.hashSync(req.body.senha, salt)

    let objectSaved = {
        nome: req.body.nome,
        email: req.body.email,
        senha: senhaCripto,
        username: req.body.username,
        image: req.body.image
    }

    let user = new users(objectSaved);
    console.log(objectSaved)

    user.save((err) => {
        if(err) {
            res.status(500).send({message: `Erro ao cadastrar user: ${err}`})
        } else {
            res.status(200).send(user.toJSON())
        }
    })
}


const login = (req, res) => {
    const email = req.body.email;
    const senha = req.body.senha;

    const senhaCripto = bcrypt.hashSync(senha, salt)

    users.findOne({email: email}, (err, user) => {
        if(err) {
            res.status(500).send({message: `Nao foi possivel buscar o usuario`})
        } else {
            console.log("Logando: ", user)
            console.log(senhaCripto)
            if(user && senhaCripto === user.senha) {
                const access_token = createAccessToken(user);

                res.set("Authorization", access_token)
                res.status(201).send({
                    user,
                    access_token
                })
            } else {
                res.status(500).send({message: `Nao foi possivel realizar o login`})
            }
        }
    })
}


const getUsers = (req, res) => {
    users.find((err, users) => {
        res.status(200).send(users)
    })
}


module.exports = {signup, login, getUsers};