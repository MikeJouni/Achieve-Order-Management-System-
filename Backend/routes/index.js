var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Achieve Order Management System' });
});

// module.exports = router;

router.use('/ap', require('./ap')); // Admin Panel
router.use('/gl', require('./gl')); // Gaming Lab
router.use('/file', require('./file')); // File


module.exports = router;
