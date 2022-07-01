var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cors = require('cors')
require('dotenv').config()
var app = express();
var postsRouter = require('./routes/posts');
var usersRouter = require('./routes/users');

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