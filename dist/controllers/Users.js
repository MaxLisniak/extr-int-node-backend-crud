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
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require('express-validator');
const logger = require("../logger.js");
exports.signup = [
    // validation rules
    body("username")
        .exists().notEmpty().withMessage("Username must be provided")
        .isAscii().withMessage("Username must only consist of ASCII(standard) characters")
        .isLength({ min: 2 }).withMessage("Username must be at least 2 characters long"),
    body("password")
        .exists().notEmpty().withMessage("Password must be provided")
        .isAscii().withMessage("Password must only consist of ASCII(standard) characters")
        .isLength({ min: 3 }).withMessage("Password must be at least 3 characters long"),
    body("confPassword")
        .exists().notEmpty().withMessage("Password confirmation must be provided"),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        logger.info("Trying to sign up a new user");
        // perform validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error(`An erorr occured while a user tried to sign up: ${JSON.stringify(errors.array())}`);
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { username, password, confPassword } = req.body;
            if (password !== confPassword) {
                logger.error("An error occured while trying to sign up: Password and Password confirmation do not match");
                return res.status(400).json({ errors: [{ msg: "Password and Password confirmation do not match" }] });
            }
            // hash password
            const salt = yield bcrypt.genSalt();
            const hashedPassword = yield bcrypt.hash(password, salt);
            // check if the user already exists
            const user = yield database("users")
                .where("username", username);
            if (user.length > 0) {
                logger.error(`A user couldn't sign up since the username ${username} already exists`);
                return res.status(409).json("User with such username already exist");
            }
            // new user object
            const newUser = {
                username: username,
                hashedPassword: hashedPassword
            };
            // insert new user
            yield database("users")
                .insert(newUser);
            logger.info(`A user signed up as ${username}`);
            return res.sendStatus(200);
        }
        catch (error) {
            logger.error(`An error occured while trying to sign up: ${JSON.stringify(error)}`);
            return res.sendStatus(500);
        }
    })
];
exports.signin = [
    // validation rules
    body("username")
        .exists().notEmpty().withMessage("Username must be provided"),
    body("password")
        .exists().notEmpty().withMessage("Password must be provided"),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // perform validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error(`An erorr occured while a user tried to sign in: ${JSON.stringify(errors.array())}`);
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            logger.info("A user is trying to sign in");
            // find user
            const user = yield database('users')
                .where("username", req.body.username);
            // check is user exists
            if (user.length === 0) {
                logger.error(`An error occured while trying to sign is, user with the username ${req.body.username} doesn't exist`);
                return res.status(404).json({ errors: [{ msg: "User not found" }] });
            }
            // check password
            const match = yield bcrypt.compare(req.body.password, user[0].hashedPassword);
            // send an error message is password is incorrect
            if (!match) {
                logger.error("An error occured while trying to sign in: Wrong password is provided");
                return res.status(400).json({ errors: [{ msg: "Wrong Password" }] });
            }
            const userId = user[0].id;
            const username = user[0].username;
            // generate access and refresh tokens
            const accessToken = jwt.sign({ userId, username }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '15s'
            });
            const refreshToken = jwt.sign({ userId, username }, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: '7d'
            });
            // add refresh token to a user in database
            yield database("users")
                .where("id", userId)
                .update({ refreshToken: refreshToken });
            // add the refresh token to the response as a cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            logger.info(`A user is logged in as: ${JSON.stringify({ username, userId })}`);
            res.json({ userId, username, accessToken });
        }
        catch (error) {
            logger.error(`An error occured while trying to sign in: ${JSON.stringify(error)}`);
            return res.status(404).json({ errors: [{ msg: "User not found" }] });
        }
    })
];
exports.signout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger.info("Trying to sign out");
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        logger.error("An error occured while trying to sign out: No refresh token is provided");
        return res.sendStatus(204);
    }
    // query a user by refresh token and check if it exists
    const user = yield database("users")
        .where("refreshToken", refreshToken);
    if (!user[0]) {
        logger.error("An error occured while trying to sign out: User with provided refresh token is not signed in");
        return res.sendStatus(204);
    }
    // remove the refresh token from the user in database
    yield database("users")
        .where("refreshToken", refreshToken)
        .update({ refreshToken: null });
    // remove the refresh token cookie from the user
    res.clearCookie('refreshToken');
    logger.info(`User with the username ${user[0].username} is signed out`);
    return res.redirect("/");
});
//# sourceMappingURL=Users.js.map