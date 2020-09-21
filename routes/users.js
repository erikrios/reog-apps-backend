const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user');
const auth = require('../middleware/auth');
const Response = require('../models/response');

const router = express.Router();

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id }).select('-password -__v');
        res.send(new Response('success'), [user], null);
    } catch (err) {
        res.send(500).send(new Response('error', null, err.message));
    }
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(new Response('error', null, error.details[0].message));

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send(new Response('error', null, 'User already registered.'));

        user = new User(_.pick(req.body, ['name', 'email', 'password']));
        user.dateRegistered = Date.now();
        user.lastLogin = Date.now();

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        const token = user.generateAuthToken();
        res.header('Auth-Token', token).send(new Response(
            'success',
            [
                _.pick(user, ['_id', 'name', 'email'])
            ],
            null
        ));
    } catch (err) {
        res.status(500).send(new Response('error', null, err.message));
    }
});

module.exports = router;