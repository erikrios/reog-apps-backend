const express = require('express');
const scrape = require('../scrape/imagescrape');
const Response = require('../models/response');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const urls = [];

        $ = await scrape('https://reogapps.blogspot.com/2020/09/reog-apps-wallpaper.html');

        $('.post-body div a').each((index, element) => {
            urls[index] = $(element).attr('href');
        });

        res.send(new Response('success', [{ urls: urls }, null]));
    } catch (err) {
        res.status(500).send(new Response('error', null, err.message));
    }
});

module.exports = router;