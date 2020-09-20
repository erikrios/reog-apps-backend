const express = require('express');
const bodyParser = require('body-parser');
const useragent = require('express-useragent');

const home = require('../routes/home');

module.exports = function (app) {
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(useragent.express());
    app.use('/', home);
}