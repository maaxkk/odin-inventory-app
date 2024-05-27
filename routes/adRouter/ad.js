const express = require('express')
const router = express.Router();
const adController = require('../../controllers/adController.js')
const {body, validationResult} = require('express-validator')
const upload = require('../../middleware/multer')

router.get('/', adController.getAll)
router.get('/create', adController.createGet)

router.post('/create', upload.single('image'),
    (req, res, next) => {
        if (!Array.isArray(req.body.category)) {
            req.body.category =
                typeof req.body.category === 'undefined' ? '' : [req.body.category];
        }
        next();
    }, body('title', 'Title must not be empty')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('author', 'Author must not be empty.')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('description', 'Description must not be empty.')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('password', 'Password must not be empty and at least 4 integers')
        .isInt()
        .isLength({min: 4})
        .escape(),
    body('category', 'Please choose category')
        .not()
        .isEmpty()
        .escape(),
    adController.createPost)

router.get('/:id/update', adController.updateGet)

router.post('/:id/update', (req, res, next) => {
        if (!Array.isArray(req.body.category)) {
            req.body.category =
                typeof req.body.category === 'undefined' ? '' : [req.body.category];
        }
        next();
    }, body('title', 'Title must not be empty')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('author', 'Author must not be empty.')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('description', 'Description must not be empty.')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('password', 'Password must not be empty and at least 4 integers')
        .isInt()
        .isLength({min: 4})
        .escape(),
    body('category', 'Please choose category')
        .not()
        .isEmpty()
        .escape(),
    adController.updatePost)

router.get('/:id/delete', adController.deleteGet)
router.post('/:id/delete', adController.deletePost)

router.get('/:id', adController.getById)

module.exports = router


