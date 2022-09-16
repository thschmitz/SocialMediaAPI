const bcrypt = require("bcrypt");
const crypt = require("crypto");

const users = require("../models/User");

require("dotenv").config();



const signup = (req, res) => {
    let user = new users(req.body);
    console.log(req.body)

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

    users.findOne({senha: senha, email: email}, (err, user) => {
        if(err) {
            res.status(500).send({message: `Nao foi possivel buscar o usuario`})
        } else {
            if(user) {
                const access_token = 0;

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