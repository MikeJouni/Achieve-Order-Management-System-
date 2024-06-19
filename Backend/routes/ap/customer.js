var express = require('express');
var router = express.Router();
const customerController = require('../../controllers/ap/customer');


//  Routes & Functions

router.post("/create", customerController.createCustomer);
router.patch("/update", customerController.updateCustomer);
router.delete("/delete/:customerId", customerController.deleteCustomer);
router.get("/get-one/:customerId", customerController.getOneCustomer);
router.get("/get-all", customerController.getAllCustomers);
router.get("/get-by-company/:companyId", customerController.getCustomersByCompany);


module.exports = router;
