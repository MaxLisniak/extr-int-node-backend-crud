const database = require('../knex.js');
const jwt = require("jsonwebtoken");
const logger = require("../logger.js");

// return new access token
module.exports.handleRefreshToken =  async (req, res) => {
    
    logger.info("User is trying to refresh a token...");
    const cookies = req.cookies;
    // check if a refresh token was provided
    if (!cookies?.refreshToken) { 
        logger.error("A token cannot be refreshed as no refresh token provided")
        return res.sendStatus(401);
    };
    const refreshToken = cookies.refreshToken;

    // find user by refresh token
    let foundUser = await database("users")
    .where("refreshToken", refreshToken);
    if (foundUser.length === 0) {
        logger.error("A token cannot be refreshed, as the user hasn't been validly authenticated")
        return res.sendStatus(403);
    }; //Forbidden 
    foundUser = foundUser[0];
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) {
                logger.error("An error occured while verifying the privided refresh token")
                return res.sendStatus(403)
            };
            // new access token
            const accessToken = jwt.sign(
                { userId: decoded.userId, username: decoded.username }, 
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15s' },
            );
            logger.info(`The access token is refreshed`)
            res.json({ accessToken })
        }
    );
}
