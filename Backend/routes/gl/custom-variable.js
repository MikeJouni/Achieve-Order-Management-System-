var express = require('express');
var router = express.Router();
const customVariableController = require('../../controllers/gl/custom-variable');
const { multerUploadRoute } = require('../../services/utils');


//  Routes & Functions

router.post("/update-login-background", multerUploadRoute, customVariableController.updateLoginBackground);
router.get("/get-login-background", customVariableController.getLoginBackground);

// router.post("/create", customVariableController.createCustomVariable);
// router.patch("/update", customVariableController.updateCustomVariable);
// router.delete("/delete/:customVariableId", customVariableController.deleteCustomVariable);
// router.get("/get-one/:customVariableId", customVariableController.getOneCustomVariable);
// router.get("/get-all", customVariableController.getAllCustomVariables);
router.get("/get-by-filter-web", customVariableController.getCustomVariablesByFilterWeb);


module.exports = router;
