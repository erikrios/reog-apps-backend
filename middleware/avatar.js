const multer = require('multer');
const Response = require('../models/response');

module.exports = function (req, res, next) {

    if (!(req.header('Content-Type').includes('multipart/form-data'))) {
        return res.status(400).send(new Response('error', null, 'Content-Type must be multipart/form-data.'));
    }

    const storage = multer.memoryStorage();

    const upload = multer({
        storage: storage, limits: { fileSize: 500000 }, fileFilter: (req, file, cb) => {
            if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
                cb(null, true);
            } else {
                cb(null, false)
                return cb(new Error('Image format must be .png, .jpg, or .jpeg.'));
            }
        }
    }).single('avatar');

    upload(req, res, err => {
        if (err) return res.status(400).send(new Response('error', null, err.message));
        next();
    });
};