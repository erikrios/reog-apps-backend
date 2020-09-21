const express = require('express');
const { News, validate } = require('../models/news');
const Response = require('../models/response');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
    // Destructure page and limit, and set the default values
    const { page = 1, limit = 10 } = req.query;

    try {
        const news = await News.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await News.countDocuments();

        res.send(new Response(
            'success',
            [
                {
                    news: news,
                    totalPages: Math.ceil(count / limit),
                    currentPage: page
                }
            ],
            null
        ));
    } catch (err) {
        res.status(500).send(new Response('error', null, err.message));
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const news = await News
            .findOneAndUpdate({ _id: id }, {
                $inc: {
                    views: 1
                }
            }, { new: true })
            .select('-__v');

        if (!news) return res.status(404).send(new Response('error', null, 'News with given id was not found.'))

        res.send(new Response('success', [news], null));
    } catch (err) {
        res.status(500).send(new Response('error', null, err.message));
    }
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(new Response('error', null, error.details[0].message));

    if (!req.user.isAdmin) return res.status(401).send(new Response('error', null, 'Access denied for non-admin.'));

    try {
        const news = new News({
            title: req.body.title,
            description: req.body.description
        });

        await news.save();
        res.send(send(new Response('success', [news], null)));
    } catch (err) {
        res.status(500).send(new Response('error', null, err.message));
    }
});

router.put('/:id', auth, (req, res) => {
    const { error } = req.body;
    if (error) return res.status(400).send(new Response('error', null, error.details[0].message));

    if (!req.user.isAdmin) return res.status(401).send(new Response('error', null, 'Access denied for non-admin.'));

    const id = req.params.id;

    try {
        const news = await News.findOneAndUpdate({ _id: id }, {
            $set: {
                'title': req.body.title,
                'description': req.body.description
            }
        }, { new: true });

        if (!news) return res.status(404).send(new Response('error', null, 'News with given id was not found.'));
        res.send(new Response('success', [news], null));
    } catch (err) {
        res.status(500).send(new Response('error', null, err.message));
    }
});

module.exports = router;