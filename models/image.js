const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new mongoose.Schema({
    image: {
        type: Buffer,
        required: true
    },
    news: { type: Schema.Types.ObjectId, ref: 'News' },
    site: { type: Schema.Types.ObjectId, ref: 'Sites' }
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;