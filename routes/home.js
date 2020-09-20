const express = require('express');
const config = require('config');

const router = express.Router();

router.get('/', (req, res) => {
    const message = config.get('message');
})

module.exports = router;