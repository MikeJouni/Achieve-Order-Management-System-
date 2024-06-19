var express = require('express');
var router = express.Router();
const customerDebtController = require('../../controllers/ap/customer-debt');


//  Routes & Functions

router.post("/create", customerDebtController.createCustomerDebt);
router.patch("/update", customerDebtController.updateCustomerDebt);
router.delete("/delete/:customerDebtId", customerDebtController.deleteCustomerDebt);
router.get("/get-one/:customerDebtId", customerDebtController.getOneCustomerDebt);
router.get("/get-all", customerDebtController.getAllCustomerDebts);
router.get("/get-by-company/:companyId", customerDebtController.getCustomerDebtsByCompany);


module.exports = router;
