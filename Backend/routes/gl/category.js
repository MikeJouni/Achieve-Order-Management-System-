var express = require('express');
var router = express.Router();
const categoryController = require('../../controllers/gl/category');


//  Routes & Functions

router.post("/create", categoryController.createCategory);
router.patch("/update", categoryController.updateCategory);
router.delete("/delete/:categoryId", categoryController.deleteCategory);
router.get("/get-one/:categoryId", categoryController.getOneCategory);
router.get("/get-all", categoryController.getAllCategories);
router.get("/get-by-company/:companyId", categoryController.getCategoriesByCompany);
router.get("/get-by-filter-web", categoryController.getCategoriesByFilterWeb);


// Website APIs
router.get("/get-all-of-gl", categoryController.getAllCategoriesOfGL);


module.exports = router;
