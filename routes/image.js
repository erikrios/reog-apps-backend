const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const useragent = require('../middleware/useragent');

const router = express.Router();

const imageSchema = new mongoose.Schema(
    {
        image: Buffer
    }
);

const Image = mongoose.model('Image', imageSchema);

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     }
// });

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage, limits: { fileSize: 500000 }, fileFilter: (req, file, cb) => {
        if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
            cb(null, true);
        } else {
            cb(null, false)
            return cb(new Error('Wrong datatypes'));
        }
    }
}).single('avatar');

router.post('/', useragent, async (req, res) => {
    upload(req, res, err => {
        if (err) return res.send(err.message);

        const image = new Image({
            image: req.file.buffer
        });

        image.save()
            .then(result => {
                res.send(result);
            })
            .catch(err => {
                res.send(err);
            });

        console.log(req.file);
    });
});

router.get('/:id', useragent, async (req, res) => {
    Image.findOne({ _id: req.params.id })
        .then(result => {
            res.send(result.image.toString('base64'));
        })
        .catch(err => {
            res.send(err);
        });
});

module.exports = router;