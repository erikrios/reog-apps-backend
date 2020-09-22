const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 1,
        maxlength: 255,
        required: true
    },
    description: {
        type: String,
        minlength: 1,
        maxlength: 102400,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    views: {
        type: Number,
        default: 0
    },
    images: {
        type: [
            { image: { type: Schema.Types.ObjectId, ref: 'Image' } }
        ],
        default: []
    }
});

const News = mongoose.model('News', newsSchema);

function validateNews(news) {
    const schema = Joi.object({
        title: Joi.string().min(1).max(255).required(),
        description: Joi.string().min(1).max(102400).required()
    });

    return schema.validate(news);
}

module.exports = {
    News: News,
    validate: validateNews
};
