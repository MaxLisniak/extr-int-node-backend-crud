const jwt = require('jsonwebtoken');
require('dotenv').config();
const logger = require("../logger.js");


// check if the provided access token is valid
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        // The token is not provided
        logger.error("Cannot verify the token, no token provided")
        return res.sendStatus(401)
    }
    const token = authHeader.split(' ')[1];
    // verify the access token provided
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                logger.error("Token expired")
                return res.sendStatus(403)
            } //invalid token
            // add virified user id to request
            req.userId = decoded.userId;
            next();
        }
    );
}

module.exports = verifyToken
export {}