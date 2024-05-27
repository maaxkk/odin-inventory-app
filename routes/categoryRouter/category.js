const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/categoryController.js');
const { body, validationResult } = require('express-validator');

router.get('/', categoryController.getAll);
router.get('/create', categoryController.createGet);

router.post(
    '/create',
    body('name', 'Category name must contain at least 3 characters').trim().isLength({ min: 3 }).escape(),
    categoryController.createPost
);

router.get('/:id/update', categoryController.updateGet);

router.post(
    '/:id/update',
    body('name', 'Category name must contain at least 3 characters').trim().isLength({ min: 3 }).escape(),
    categoryController.updatePost
);

router.get('/:id/delete', categoryController.deleteGet);
router.post('/:id/delete', categoryController.deletePost);

router.get('/:id', categoryController.getById);

module.exports = router;
