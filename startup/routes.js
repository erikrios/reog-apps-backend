const express = require('express');
const bodyParser = require('body-parser');

const home = require('../routes/home');
const image = require('../routes/image');

module.exports = function (app) {
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use('/', home);
    app.use('/api/image', image);
};