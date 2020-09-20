const express = require('express');
const config = require('config');
const Response = require('../models/response');
const useragent = require('../middleware/useragent');

const router = express.Router();

router.get('/', useragent, (req, res) => {
    const message = config.get('message');
    
    res.send(new Response(
        'success',
        [
            { message: message }
        ],
        null
    ));
})

module.exports = router;