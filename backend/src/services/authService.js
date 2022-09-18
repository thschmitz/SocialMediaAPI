const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const { getTokenFromHeaders } = require('../utils/getTokenFromHeaders.js') 

dotenv.config()
const ACCESSTOKEN_SECRET = process.env.ACCESSTOKEN_SECRET;
const ACCESSTOKEN_EXPIRATION = '3s';
const REFRESHTOKEN_SECRET = process.env.REFRESHTOKEN_SECRET;
const REFRESHTOKEN_EXPIRATION = '7d';

const authService = {
    async generateAccessToken(userId) {
        return await jwt.sign(
            { roles: ['user'] },
            ACCESSTOKEN_SECRET,
            { subject: userId, expiresIn: ACCESSTOKEN_EXPIRATION }
        );
    },
    async validateAccessToken(accessToken, res) {
        const validacao = jwt.verify(accessToken, process.env.CHAVE_JWT)
        console.log("validacao: ", validacao.id)
        if(validacao.id){
            return true;
        } else {
            return res.status(500).send({message: "Token inválido"})
        }
    },
    async isAuthenticated(req) {
        const token = getTokenFromHeaders(req);
    
        try {
            await authService.validateAccessToken(token);
            return true;
        } catch (err) {   
            return false;
        }
    },
    async generateRefreshToken(userId) {
        return await jwt.sign(
            {},
            REFRESHTOKEN_SECRET,
            { subject: userId, expiresIn: REFRESHTOKEN_EXPIRATION }
        );
    },
    async validateRefreshToken(refreshToken) {
        return await jwt.verify(refreshToken, REFRESHTOKEN_SECRET);
    },
    async decodeToken(token) {
        return await jwt.decode(token);
    }
}

module.exports = {authService}
