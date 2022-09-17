const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = require("../models/User");

require("dotenv").config();

function createAccessToken(user) {
    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, process.env.CHAVE_JWT, {subject: `${user._id}`})
    return token;
}


const signup = (req, res) => {
    let senhaCripto = bcrypt.hash(req.body.senha, 12)

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


const login = async(req, res) => {
    const email = req.body.email;
    const senha = req.body.senha;


    users.findOne({email: email}, async(err, user) => {
        if(err) {
            res.status(500).json({message: `Nao foi possivel buscar o usuario`})
        } else {
            const senhaValida = await bcrypt.compare(senha, user.senha)

            if(!senhaValida){
                res.status(500).json({message: "You don't have the credentials"})
            } else {
                const access_token = createAccessToken(user);
                res.status(201).json({
                    user,
                    access_token
                })
            }

            
        }

    })
}

const getUserbyId = (req, res) => {
    const id = req.body._id;

    users.findOne({_id: id}, (err, user) => {
        if(err) {
            res.status(500).send({message: "The user searched doesn't exist! " + err})
        }

        if(user){
            res.status(200).json({
                data: {
                    user
                }
            })
        }
        
    })

    
}

const getUsers = (req, res) => {
    users.find((err, users) => {
        res.status(200).send(users)
    })
}


module.exports = {signup, login, getUsers, getUserbyId};