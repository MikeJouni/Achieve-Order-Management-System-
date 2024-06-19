var express = require('express');
var router = express.Router();
const companyController = require('../../controllers/ap/company');


//  Routes & Functions

router.post("/create", companyController.createCompany);
router.patch("/update", companyController.updateCompany);
router.patch("/update-deleted", companyController.updateCompanyDeleted);
router.patch("/update-profit-cost-visible", companyController.updateCompanyProfitCostVisible);
router.delete("/delete/:companyId", companyController.deleteCompany);
router.get("/get-one/:companyId", companyController.getOneCompany);
router.get("/get-one-profit-cost-visible/:companyId", companyController.getOneCompanyProfitCostVisible);
router.get("/get-all", companyController.getAllCompanies);
router.get("/get-by-deleted/:isDeleted", companyController.getCompaniesByDeleted);


module.exports = router;
