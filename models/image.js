const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new mongoose.Schema({
    image: {
        type: Buffer,
        required: true
    },
    article: { type: Schema.Types.ObjectId, ref: 'News' }
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;