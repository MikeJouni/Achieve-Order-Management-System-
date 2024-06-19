var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// module.exports = router;

router.use('/activity', require('./activity'));
router.use('/admin', require('./admin'));
router.use('/backup-restore', require('./backup-restore'));
router.use('/category', require('./category'));
router.use('/collected-payment', require('./collected-payment'));
router.use('/company', require('./company'));
router.use('/custom-variable', require('./custom-variable'));
router.use('/customer-debt', require('./customer-debt'));
router.use('/customer', require('./customer'));
router.use('/driver', require('./driver'));
router.use('/employee', require('./employee'));
router.use('/note-reminder', require('./note-reminder'));
// router.use('/order-item', require('./order-item'));
router.use('/order', require('./order'));
router.use('/stock', require('./stock'));
router.use('/store-payment', require('./store-payment'));


module.exports = router;
