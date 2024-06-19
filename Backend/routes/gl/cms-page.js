var express = require('express');
var router = express.Router();
const cmsPageController = require('../../controllers/gl/cms-page');


//  Routes & Functions

router.post("/create", cmsPageController.createCmsPage);
router.patch("/update", cmsPageController.updateCmsPage);
router.delete("/delete/:cmsPageId", cmsPageController.deleteCmsPage);
router.get("/get-one/:cmsPageId", cmsPageController.getOneCmsPage);
router.get("/get-all", cmsPageController.getAllCmsPages);
router.get("/get-by-company/:companyId", cmsPageController.getCmsPagesByCompany);
router.get("/get-by-filter-web", cmsPageController.getCmsPagesByFilterWeb);
router.get("/get-by-type", cmsPageController.getCmsPageByType);
router.patch("/set-by-type", cmsPageController.setCmsPageByType);


// =====================================================
// Website APIs

router.get("/get-by-type-of-gl/:cmsPageType", cmsPageController.getCmsPageByTypeOfGL);


module.exports = router;
