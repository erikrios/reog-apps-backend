const jwt = require('jsonwebtoken');
const config = require('config');
const Response = require('../models/response');

module.exports = function (req, res, next) {
    const token = req.header('Auth-Token');
    if (!token) return res.status(401).send(new Response('error', null, 'Access denied. No token provided.'));

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).send(new Response('error', null, 'Invalid token.'));
    }
}