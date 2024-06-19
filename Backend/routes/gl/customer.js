var express = require('express');
var router = express.Router();
const customerController = require('../../controllers/gl/customer');


//  Routes & Functions

router.post("/create", customerController.createCustomer);
router.patch("/update", customerController.updateCustomer);
router.delete("/delete/:customerId", customerController.deleteCustomer);
router.get("/get-one/:customerId", customerController.getOneCustomer);
router.get("/get-all", customerController.getAllCustomers);
router.get("/get-by-company/:companyId", customerController.getCustomersByCompany);
router.get("/get-by-filter-web", customerController.getCustomersByFilterWeb);
router.patch("/update-block", customerController.updateCustomerBlock);


// =====================================================
// Website APIs

router.post("/register", customerController.registerCustomer);
router.patch("/update-data", customerController.updateCustomerData);
router.post("/login", customerController.loginCustomer);
router.post("/email-verification-code", customerController.emailVerificationCodeCustomer);
router.patch("/change-password", customerController.changePassword);
router.patch("/update-password", customerController.updatePassword);
router.get("/get-home-data-of-gl", customerController.getHomeDataOfGL);


module.exports = router;
