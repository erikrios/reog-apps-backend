const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    news: { type: Schema.Types.ObjectId, ref: 'News' },
    site: { type: Schema.Types.ObjectId, ref: 'Site' },
    food: { type: Schema.Types.ObjectId, ref: 'Food' },
    history: { type: Schema.Types.ObjectId, ref: 'History' }
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;