const express = require('express');
const router = express.Router();

const authorRouter = require('./authorRouter/author.js');
const adRouter = require('./adRouter/ad.js');
const categoryRouter = require('./categoryRouter/category.js');

router.use('/catalog/category', categoryRouter);
router.use('/catalog/author', authorRouter);
router.use('/catalog/ad', adRouter);

/* GET home page. */
router.get('/', function (req, res, next) {
    res.redirect('/catalog');
});

router.get('/catalog', function (req, res, next) {
    res.render('index', { title: 'OLD' });
});

module.exports = router;
