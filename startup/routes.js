const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const home = require('../routes/home');
const users = require('../routes/users');
const auth = require('../routes/auth');
const news = require('../routes/news');
const sites = require('../routes/sites');
const foods = require('../routes/foods');
const histories = require('../routes/histories');
const wallpapers = require('../routes/wallpapers');
const comments = require('../routes/comments');

module.exports = function (app) {
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());
    app.use('/', home);
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use('/api/news', news);
    app.use('/api/sites', sites);
    app.use('/api/foods', foods);
    app.use('/api/histories', histories);
    app.use('/api/wallpapers', wallpapers);
    app.use('/api/comments', comments);
};