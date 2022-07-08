"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
const corsConfig = {
    origin: "http://localhost:3000",
    credentials: true
};
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', postsRouter);
app.use('/users', usersRouter);
module.exports = app;
//# sourceMappingURL=app.js.map