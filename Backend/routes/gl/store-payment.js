var express = require('express');
var router = express.Router();
const storePaymentController = require('../../controllers/gl/store-payment');


//  Routes & Functions

router.post("/create", storePaymentController.createStorePayment);
router.patch("/update", storePaymentController.updateStorePayment);
router.delete("/delete/:storePaymentId", storePaymentController.deleteStorePayment);
router.get("/get-one/:storePaymentId", storePaymentController.getOneStorePayment);
router.get("/get-all", storePaymentController.getAllStorePayments);
router.get("/get-by-company/:companyId", storePaymentController.getStorePaymentsByCompany);
router.get("/get-by-filter-web", storePaymentController.getStorePaymentsByFilterWeb);


module.exports = router;
