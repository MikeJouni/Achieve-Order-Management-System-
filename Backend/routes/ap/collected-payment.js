var express = require('express');
var router = express.Router();
const collectedPaymentController = require('../../controllers/ap/collected-payment');


//  Routes & Functions

router.post("/create", collectedPaymentController.createCollectedPayment);
router.patch("/update", collectedPaymentController.updateCollectedPayment);
router.delete("/delete/:collectedPaymentId", collectedPaymentController.deleteCollectedPayment);
router.get("/get-one/:collectedPaymentId", collectedPaymentController.getOneCollectedPayment);
router.get("/get-all", collectedPaymentController.getAllCollectedPayments);
router.get("/get-by-company/:companyId", collectedPaymentController.getCollectedPaymentsByCompany);


module.exports = router;
