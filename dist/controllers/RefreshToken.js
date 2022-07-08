"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const database = require('../knex.js');
const jwt = require("jsonwebtoken");
const logger = require("../logger.js");
// return new access token
module.exports.handleRefreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger.info("User is trying to refresh a token...");
    const cookies = req.cookies;
    // check if a refresh token was provided
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.refreshToken)) {
        logger.error("A token cannot be refreshed as no refresh token provided");
        return res.sendStatus(401);
    }
    const refreshToken = cookies.refreshToken;
    // find user by refresh token
    let foundUser = yield database("users")
        .where("refreshToken", refreshToken);
    if (foundUser.length === 0) {
        logger.error("A token cannot be refreshed, as the user hasn't been validly authenticated");
        return res.sendStatus(403);
    } //Forbidden 
    foundUser = foundUser[0];
    // evaluate jwt 
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || foundUser.username !== decoded.username) {
            logger.error("An error occured while verifying the privided refresh token");
            return res.sendStatus(403);
        }
        // new access token
        const accessToken = jwt.sign({ userId: decoded.userId, username: decoded.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
        logger.info(`The access token is refreshed`);
        res.json({ accessToken });
    });
});
//# sourceMappingURL=RefreshToken.js.map