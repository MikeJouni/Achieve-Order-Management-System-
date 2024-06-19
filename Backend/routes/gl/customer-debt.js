var express = require('express');
var router = express.Router();
const customerDebtController = require('../../controllers/gl/customer-debt');


//  Routes & Functions

router.post("/create", customerDebtController.createCustomerDebt);
router.patch("/update", customerDebtController.updateCustomerDebt);
router.delete("/delete/:customerDebtId", customerDebtController.deleteCustomerDebt);
router.get("/get-one/:customerDebtId", customerDebtController.getOneCustomerDebt);
router.get("/get-all", customerDebtController.getAllCustomerDebts);
router.get("/get-by-company/:companyId", customerDebtController.getCustomerDebtsByCompany);
router.get("/get-by-filter-web", customerDebtController.getCustomerDebtsByFilterWeb);


module.exports = router;
