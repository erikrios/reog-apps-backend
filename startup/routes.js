const express = require('express');
const bodyParser = require('body-parser');

const home = require('../routes/home');
const users = require('../routes/users');
const auth = require('../routes/auth');
const image = require('../routes/image');

module.exports = function (app) {
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use('/', home);
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use('/api/image', image);
};