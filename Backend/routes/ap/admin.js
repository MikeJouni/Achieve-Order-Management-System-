var express = require('express');
var router = express.Router();
const adminController = require('../../controllers/ap/admin');
const { multerUploadRoute } = require('../../services/utils');


//  Routes & Functions

router.post("/create", adminController.createAdmin);
router.patch("/update", adminController.updateAdmin);
router.post("/update-profile-photo/:adminId", multerUploadRoute, adminController.updateProfilePhoto);
router.post("/login", adminController.loginAdmin);
router.post("/email-verification-code", adminController.emailVerificationCodeAdmin);
router.patch("/change-password", adminController.changePassword);
router.patch("/update-password", adminController.updatePassword);
router.delete("/delete/:adminId", adminController.deleteAdmin);
router.get("/get-one/:adminId", adminController.getOneAdmin);
router.get("/get-one-detail/:adminId", adminController.getOneAdminDetail);
router.get("/get-unassign-by-company/:companyId", adminController.getUnassignAdminsByCompany);
router.get("/get-all", adminController.getAllAdmins);
router.get("/get-dashboard-stats-by-company/:companyId", adminController.getDashboardStatsByCompany);
router.get("/get-sales-analytics-by-company/:companyId", adminController.getSalesAnalyticsByCompany);
router.get("/get-store-payment-analytics-by-company/:companyId", adminController.getStorePaymentAnalyticsByCompany);
router.get("/get-order-amounts-by-company-and-date", adminController.getOrderAmountsByCompanyAndDate);
router.get("/get-store-payment-amounts-by-company-and-date", adminController.getStorePaymentAmountsByCompanyAndDate);
router.get("/get-collected-payment-amounts-by-company-and-date", adminController.getCollectedPaymentAmountsByCompanyAndDate);
router.get("/get-customer-debt-amounts-by-company-and-date", adminController.getCustomerDebtAmountsByCompanyAndDate);


module.exports = router;
