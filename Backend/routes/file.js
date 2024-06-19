var express = require('express');
var router = express.Router();
const fileController = require('../controllers/file.js');
const { multerUploadRoute } = require('../services/utils.js');


//  Routes & Functions

router.post("/upload", multerUploadRoute, fileController.uploadFile);
router.delete("/remove/:fileName", fileController.removeFile);


module.exports = router;
