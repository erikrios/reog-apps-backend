const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async function (url) {
    const { data } = await axios.get(url);
    return cheerio.load(data);
};