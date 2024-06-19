var express = require('express');
var router = express.Router();
const sliderController = require('../../controllers/gl/slider');
const { multerUploadRoute } = require('../../services/utils');
const { multerMultipleUploadRoute } = require('../../services/file');


//  Routes & Functions

router.post("/create", sliderController.createSlider);
router.patch("/update", sliderController.updateSlider);
router.post("/update-file/:sliderId", multerUploadRoute, sliderController.updateSliderFile);
router.post("/add-multiple-by-company/:companyId", multerMultipleUploadRoute, sliderController.addMultipleSlidersByCompany);
router.delete("/delete/:sliderId", sliderController.deleteSlider);
router.get("/get-all", sliderController.getAllSliders);
router.get("/get-by-company/:companyId", sliderController.getSlidersByCompany);
router.get("/get-by-filter-web", sliderController.getSlidersByFilterWeb);




module.exports = router;
