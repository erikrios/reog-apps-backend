const express = require('express');
const _ = require('lodash');
const { History, validate } = require('../models/history');
const Image = require('../models/image');
const Response = require('../models/response');
const auth = require('../middleware/auth');
const avatar = require('../middleware/avatar');

const router = express.Router();

router.get('/', async (req, res) => {
    // Destructure page and limit, and set the default values
    const { page = 1, limit = 10 } = req.query;

    try {
        const histories = await History
            .find()
            .populate({ path: 'images', model: 'Image' })
            .sort('-date')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-__v')
            .exec();

        const count = await History.countDocuments();

        const results = []

        histories.forEach(history => {
            const result = _.pick(history, ['_id', 'title', 'description', 'date', 'views', 'images']);
            results.push(result);
        });

        res.send(new Response(
            'success',
            [
                {
                    history: results,
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
        const history = await History
            .findOneAndUpdate({ _id: id }, {
                $inc: {
                    views: 1
                }
            }, { new: true })
            .populate({ path: 'images', model: 'Image' })
            .select('-__v');

        if (!history) return res.status(404).send(new Response('error', null, 'History with given id was not found.'))

        const result = _.pick(history, ['_id', 'title', 'description', 'date', 'views', 'images']);

        res.send(new Response('success', [result], null));
    } catch (err) {
        res.status(500).send(new Response('error', null, err.message));
    }
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(new Response('error', null, error.details[0].message));

    if (!req.user.isAdmin) return res.status(401).send(new Response('error', null, 'Access denied for non-admin.'));

    try {
        const history = new History({
            title: req.body.title,
            description: req.body.description,
            date: Date.now()
        });

        await history.save();
        res.send(new Response('success', [history], null));
    } catch (err) {
        res.status(500).send(new Response('error', null, err.message));
    }
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(new Response('error', null, error.details[0].message));

    if (!req.user.isAdmin) return res.status(401).send(new Response('error', null, 'Access denied for non-admin.'));

    const id = req.params.id;

    try {
        const history = await History.findOneAndUpdate({ _id: id }, {
            $set: {
                'title': req.body.title,
                'description': req.body.description
            }
        }, { new: true }).select('-__v');

        if (!history) return res.status(404).send(new Response('error', null, 'History with given id was not found.'));
        res.send(new Response('success', [history], null));
    } catch (err) {
        res.status(500).send(new Response('error', null, err.message));
    }
});

router.delete('/:id', auth, async (req, res) => {
    if (!req.user.isAdmin) return res.status(401).send(new Response('error', null, 'Access denied for non-admin.'));

    const id = req.params.id;

    try {
        const history = await History.findOneAndDelete({ _id: id }).select('-__v');

        if (!history) return res.status(404).send(new Response('error', null, 'History with given id was not found.'));
        res.send(new Response('success', [history], null));
    } catch (err) {
        res.status(500).send(new Response('error', null, err.message));
    }
});

router.post('/image', auth, async (req, res) => {
    if (!req.user.isAdmin) return res.status(401).send(new Response('error', null, 'Access denied for non-admin.'));

    const id = req.query.id

    try {
        const foodCount = await History.countDocuments({ _id: id });
        if (foodCount < 1) return res.status(404).send(new Response('error', null, 'History with given id was not found.'));

        const image = new Image({
            image: req.body,
            history: id
        });

        await History.updateOne({ _id: id }, { $push: { images: image._id } });
        await image.save();

        res.send(new Response('success', null, null));
    } catch (err) {
        res.status(500).send(new Response('error', null, err.message));
    }
});

router.put('/image/:id', auth, async (req, res) => {
    if (!req.user.isAdmin) return res.status(401).send(new Response('error', null, 'Access denied for non-admin.'));

    const id = req.params.id;

    try {
        const imageCount = await Image.countDocuments({ _id: id });
        if (imageCount < 1) return res.status(404).send(new Response('error', null, 'Image with given id was not found.'));

        await Image.updateOne({ _id: id }, { $set: { image: req.body } });
        res.send(new Response('success', null, null));
    } catch (err) {
        res.status(500).send(new Response('error', null, err.message));
    }
});

router.delete('/image/:id', auth, async (req, res) => {
    if (!req.user.isAdmin) return res.status(401).send(new Response('error', null, 'Access denied for non-admin.'));

    const id = req.params.id

    try {
        const imageCount = await Image.countDocuments({ _id: id });
        if (imageCount < 1) return res.status(404).send(new Response('error', null, 'Image with given id was not found.'));

        await Image.deleteOne({ _id: id });
        res.send(new Response('success', null, null));
    } catch (err) {
        res.status(500).send(new Response('error', null, err.message));
    }
});

module.exports = router;