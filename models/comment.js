const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        minlength: 1,
        maxlength: 1024,
        required: true
    },
    user: {
        type: new mongoose.Schema({
            name: {
                type: String,
                minlength: 5,
                maxlength: 50,
                required: true
            }
        }),
        required: true
    },
    article: {
        type: new mongoose.Schema({
            _id: Schema.Types.ObjectId
        }),
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

const Comment = mongoose.model('Comment', commentSchema);

function validateComment(comment) {
    const schema = Joi.object({
        comment: Joi.string().min(1).max(1024).required()
    });

    return schema.validate(comment);
}

module.exports = {
    Comment: Comment,
    validateComment: validateComment
};