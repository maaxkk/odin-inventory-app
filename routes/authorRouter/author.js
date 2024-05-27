const express = require('express');
const router = express.Router();
const authorController = require('../../controllers/authorController.js');
const { body, validationResult } = require('express-validator');

router.get('/', authorController.getAll);
router.get('/create', authorController.createGet);

router.post(
    '/create',
    body('name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Name must be specified')
        .isAlphanumeric()
        .withMessage('Name has non-alphanumeric characters.'),
    body('last_name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Last name must be specified')
        .isAlphanumeric()
        .withMessage('Last name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ values: 'falsy' }).isISO8601().toDate(),
    authorController.createPost
);

router.get('/:id/update', authorController.updateGet);

router.post(
    '/:id/update',
    body('name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Name must be specified')
        .isAlphanumeric()
        .withMessage('Name has non-alphanumeric characters.'),
    body('last_name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Last name must be specified')
        .isAlphanumeric()
        .withMessage('Last name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ values: 'falsy' }).isISO8601().toDate(),
    authorController.updatePost
);

router.get('/:id/delete', authorController.deleteGet);
router.post('/:id/delete', authorController.deletePost);

router.get('/:id', authorController.getById);

module.exports = router;
