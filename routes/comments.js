const express = require('express');
const { Comment, validateComment } = require('../models/comment');
const { News } = require('../models/news');
const Response = require('../models/response');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
    const id = req.query.id;

    try {
        const newsCount = await News.countDocuments({ _id: id });
        if (newsCount < 1) return res.status(404).send(new Response('error', null, 'News with given id was not found.'));

        const comments = await Comment
            .find({ 'article._id': id })
            .sort('-date')
            .select('-__v');
        res.send(new Response('success', [comments], null));
    } catch (err) {
        res.status(500).send(new Response('error', null, err.message));
    }
});

router.post('/', auth, async (req, res) => {
    const { error } = validateComment(req.body);
    if (error) return res.status(400).send(new Response('error', null, error.details[0].message));

    const id = req.query.id;

    try {
        const newsCount = await News.countDocuments({ _id: id });
        if (newsCount < 1) return res.status(404).send(new Response('error', null, 'News with given id was not found.'));

        const comment = new Comment({
            comment: req.body.comment,
            user: {
                _id: req.user._id,
                name: req.user.name
            },
            article: {
                _id: id
            },
            date: Date.now()
        });

        await comment.save();
        res.send(new Response('success', [comment], null));
    } catch (err) {
        res.status(500).send(new Response('error', null, err.message));
    }
});

module.exports = router;