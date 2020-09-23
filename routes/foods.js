const express = require('express');
const _ = require('lodash');
const { Food, validate } = require('../models/food
');
const Image = require('../models/image');
const Response = require('../models/response');
const auth = require('../middleware/auth');
const avatar = require('../middleware/avatar');

const router = express.Router();

router.get('/', async (req, res) => {
    // Destructure page and limit, and set the default values
    const { page = 1, limit = 10 } = req.query;

    try {
        const food
         = await Food
            .find()
            .populate({ path: 'images', model: 'Image' })
            .sort('-date')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-__v')
            .exec();

        const count = await Food.countDocuments();

        const results = []

        food
        .forEach(food
            Element => {
            const result = _.pick(food
                Element, ['_id', 'title', 'description', 'date', 'views']);
            const encodeImage = [];

            food
            Element.images.forEach(image => {
                encodeImage.push({ _id: image._id, image: image.image.toString('base64') });
            });

            result.images = [...encodeImage];

            results.push(result);
        });

        res.send(new Response(
            'success',
            [
                {
                    food
                    : results,
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
        const food
         = await Food
            .findOneAndUpdate({ _id: id }, {
                $inc: {
                    views: 1
                }
            }, { new: true })
            .populate({ path: 'images', model: 'Image' })
            .select('-__v');

        if (!food
            ) return res.status(404).send(new Response('error', null, 'Food with given id was not found.'))

        // Encode the byte array to base64
        const encodeImage = [];
        food
        .images.forEach(image => {
            encodeImage.push({ _id: image._id, image: image.image.toString('base64') });
        });

        const result = _.pick(food
            , ['_id', 'title', 'description', 'date', 'views']);
        result.images = [...encodeImage];

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
        const food
         = new Food({
            title: req.body.title,
            description: req.body.description,
            date: Date.now()
        });

        await food
        .save();
        res.send(new Response('success', [food
        ], null));
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
        const food
         = await Food.findOneAndUpdate({ _id: id }, {
            $set: {
                'title': req.body.title,
                'description': req.body.description
            }
        }, { new: true }).select('-__v');

        if (!food
            ) return res.status(404).send(new Response('error', null, 'Food with given id was not found.'));
        res.send(new Response('success', [food
        ], null));
    } catch (err) {
        res.status(500).send(new Response('error', null, err.message));
    }
});

router.delete('/:id', auth, async (req, res) => {
    if (!req.user.isAdmin) return res.status(401).send(new Response('error', null, 'Access denied for non-admin.'));

    const id = req.params.id;

    try {
        const food
         = await Food.findOneAndDelete({ _id: id }).select('-__v');

        if (!food
            ) return res.status(404).send(new Response('error', null, 'Food with given id was not found.'));
        res.send(new Response('success', [food
        ], null));
    } catch (err) {
        res.status(500).send(new Response('error', null, err.message));
    }
});

router.post('/image', [auth, avatar], async (req, res) => {
    if (!req.user.isAdmin) return res.status(401).send(new Response('error', null, 'Access denied for non-admin.'));

    const id = req.query.id

    try {
        const food
        Count = await Food.countDocuments({ _id: id });
        if (food
            Count < 1) return res.status(404).send(new Response('error', null, 'Food with given id was not found.'));

        const image = new Image({
            image: req.file.buffer,
            food
            : id
        });

        await Food.updateOne({ _id: id }, { $push: { images: image._id } });
        await image.save();

        res.send(new Response('success', null, null));
    } catch (err) {
        res.status(500).send(new Response('error', null, err.message));
    }
});

router.put('/image/:id', [auth, avatar], async (req, res) => {
    if (!req.user.isAdmin) return res.status(401).send(new Response('error', null, 'Access denied for non-admin.'));

    const id = req.params.id;

    try {
        const imageCount = await Image.countDocuments({ _id: id });
        if (imageCount < 1) return res.status(404).send(new Response('error', null, 'Image with given id was not found.'));

        await Image.updateOne({ _id: id }, { $set: { image: req.file.buffer } });
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