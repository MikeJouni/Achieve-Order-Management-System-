var express = require('express');
var router = express.Router();
const stockController = require('../../controllers/ap/stock');
const { multerUploadRoute } = require('../../services/utils');


//  Routes & Functions

router.post("/create", stockController.createStock);
router.patch("/update", stockController.updateStock);
router.patch("/update-visible", stockController.updateStockVisible);
router.post("/update-image/:stockId", multerUploadRoute, stockController.updateStockImage);
router.delete("/delete/:stockId", stockController.deleteStock);
router.get("/get-detail/:stockId", stockController.getStockDetail);
router.get("/get-all", stockController.getAllStocks);
router.get("/get-by-company/:companyId", stockController.getStocksByCompany);
router.get("/get-by-company-and-category", stockController.getStocksByCompanyAndCategory);
router.get("/get-list-by-company/:companyId", stockController.getListStocksByCompany);
router.get("/get-visible-list-by-company/:companyId", stockController.getVisibleListStocksByCompany);


module.exports = router;
