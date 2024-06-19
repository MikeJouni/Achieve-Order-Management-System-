var express = require('express');
var router = express.Router();
const backupRestoreController = require('../../controllers/ap/backup-restore');
const { multerUploadRoute } = require('../../services/utils');


//  Routes & Functions

router.get("/backup-database", backupRestoreController.backupDatabase);
router.get("/backup-database-by-company/:companyId", backupRestoreController.backupDatabaseByCompany);
router.post("/restore-database", multerUploadRoute, backupRestoreController.restoreDatabase);

module.exports = router;
