const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")
const users = require("../models/User.js")
const { authService } = require('../services/authService.js');
const { getTokenFromHeaders } = require('../utils/getTokenFromHeaders.js')
const bcrypt = require("bcrypt")

dotenv.config()
function criaTokenJWT(user){
    const payload = {
        id: user._id
    };

    const token = jwt.sign(payload, `${process.env.CHAVE_JWT}`, {subject: `${user._id}`, expiresIn: "30s"});
    return token;
}

function criaRefreshToken(userId){
    return jwt.sign(
        {},
        process.env.REFRESHTOKEN_SECRET,
        { subject: `${userId}`, expiresIn: "7d" }
    );
}

class UserController {
    static listarUser = (req, res) => {
        users.find((err, user) => {
            res.status(200).send(user)
        })
    }
    static cadastrarUser = (req, res) => {
        let user = new users(req.body);
        user.save((err) => {
            if(err){
                res.status(500).send({message: `Erro ao cadastrar user: ${err}`})
            } else {
                res.status(201).send(user.toJSON())
            }
        })
    }
    static atualizarUser = (req, res) => {
        const id = req.params.id
        users.findByIdAndUpdate(id, req.body, (err, user) => {
            if(err){
                res.status(500).send({message: `Erro ao atualizar user: ${err}`})
            } else{
                res.status(200).send({message: `User, com id ${id}, atualizado com sucesso`})
            }
        })
    }
    static listarUserPorId = (req, res) => {
        const id = req.params.id

        users.findById(id, (err, user) => {
            if(err){
                res.status(400).send({message: `Erro ao buscar user: ${err.message}`})
            } else {
                res.status(200).send(user)
            }
        })
    }

    static deletarUserPorId = (req, res) => {
        const id = req.params.id;

        users.findOneAndDelete(id, (err, user) => {
            if(err) {
                res.status(400).send({message: `Erro ao deletar user: ${err.message}`})
            } else {
                res.status(200).send(user)
            }
        })
    }

    static listarUserPorNome = (req, res) => {
        const nome = req.query.nome

        users.find({"nome": nome}, {}, (err, user) => {
            res.status(200).send(user)
        })
    }

    static signIn = (req, res) => {
        const email = req.body.email
        const senha = req.body.senha
        users.findOne({email: email}, async(err, user) => {
            if(err){
                res.status(400).send({message: `Erro ao buscar user: ${err.message}`})
            } else {
                const senhaValida = await bcrypt.compare(senha, user.senha)

                if(!senhaValida){
                    res.status(500).json({message: "You don't have the credentials"})
                } else {
                    const access_token = criaTokenJWT(user)
                    const refresh_token = criaRefreshToken(user._id)
                    console.log(access_token)
                    res.set("Authorization", access_token);
                    res.status(200).json({
                        user,
                        access_token,
                        refresh_token
                    })
                }
            }
        })
    }

    static session = async (req, res) => {

        const token = getTokenFromHeaders(req);
        if(!token) return res.status(401).json({ error: { status: 401, message: 'You don\'t have credentials' } });
        const decodedToken = await authService.decodeToken(token);

        try {

            if(decodedToken){
                users.findOne({ _id: decodedToken.sub }, function (err, user) {
                    if (err || user === null) {
                        res.status(401).json({
                        error: {
                            status: 401,
                            message: 'Invalid access token, please login again.',
                        }
                        });
                    }
            
                    res.status(200).json({
                        data: {
                            user: {
                                username: user.nome,
                                email: user.email,
                            },
                        }
                    });
                });
            } else {
                res.status(500).json({
                    message: "Erro no token"
                })
            }
            
    
        } catch(err) {
            console.log(err)                    
            res.status(500).json({message: "Erro na sessao"})
        }

    }

    static refreshTokens = async (req, res) => {
        const refreshToken = req.body.refreshToken;
        try {
            const sub = await authService.validateRefreshToken(refreshToken);
      
            users.findOne({ _id: sub, refreshToken }, async function (err, user) {
              if (err) return res.status(500).json({ error: { status: 500, message: 'Internal server error', } });
      
              if(!user?._id) {
                return res.status(401).json({
                  error: {
                    status: 401,
                    message: 'Invalid refresh token, please login again.',
                  }
                });
              }
      
              const tokens = {
                access_token: await authService.generateAccessToken(sub),
                refresh_token: await authService.generateRefreshToken(sub),
              };
      
              users.updateOne({ _id: sub }, { $set: { refresh_token: tokens.refresh_token } }, function (err) {
                if (err) throw new Error('Not available to set refresh token');
                
                return res.status(200).json({
                  data: tokens,
                });
              });
            });
      
          } catch (err) {
            return res.status(401).json({
              error: {
                status: 401,
                message: 'Invalid refresh token, please login again.',
              }
            });
          }
    }
}


module.exports = UserController