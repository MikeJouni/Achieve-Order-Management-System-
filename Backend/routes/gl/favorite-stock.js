var express = require('express');
var router = express.Router();
const favoriteStockController = require('../../controllers/gl/favorite-stock');


//  Routes & Functions

router.post("/create", favoriteStockController.createFavoriteStock);
router.patch("/update", favoriteStockController.updateFavoriteStock);
router.delete("/delete/:favoriteStockId", favoriteStockController.deleteFavoriteStock);
router.get("/get-one/:favoriteStockId", favoriteStockController.getOneFavoriteStock);
router.get("/get-all", favoriteStockController.getAllFavoriteStocks);
router.get("/get-by-company/:companyId", favoriteStockController.getFavoriteStocksByCompany);
router.get("/get-by-filter-web", favoriteStockController.getFavoriteStocksByFilterWeb);


// =====================================================
// Website APIs

router.patch("/set-of-gl", favoriteStockController.setFavoriteStockOfGL);


module.exports = router;
