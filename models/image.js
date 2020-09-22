const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    image: {
        type: Buffer,
        required: true
    },
    article: {
        type: new mongoose.Schema({
            title: {
                type: String,
                minlength: 1,
                maxlength: 255,
                required: true
            }
        }),
        required: true
    }
});

const Image = mongoose.model('Image', imageSchema);

module.exports = {
    imageSchema: imageSchema,
    Image: Image
};