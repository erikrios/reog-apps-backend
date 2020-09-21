const mongoose = require('mongoose');

const avatarSchema = new mongoose.Schema({
    image: {
        type: Buffer,
        required: true
    },
    user: {
        type: new mongoose.Schema({
            name: {
                type: String,
                minlength: 5,
                maxlength: 255,
                required: true
            }
        }),
        required: true
    }
});

const Avatar = mongoose.model('Avatar', avatarSchema);

module.exports = Avatar;