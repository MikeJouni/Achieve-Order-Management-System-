var express = require('express');
var router = express.Router();
const contactUsController = require('../../controllers/gl/contact-us');


//  Routes & Functions

router.post("/create", contactUsController.createContactUs);
router.patch("/update", contactUsController.updateContactUs);
router.delete("/delete/:contactUsId", contactUsController.deleteContactUs);
router.get("/get-one/:contactUsId", contactUsController.getOneContactUs);
router.get("/get-all", contactUsController.getAllContactUs);
router.get("/get-by-company/:companyId", contactUsController.getContactUsByCompany);
router.get("/get-by-filter-web", contactUsController.getContactUsByFilterWeb);


// =====================================================
// Website APIs

router.post("/create-of-gl", contactUsController.createContactUsOfGl);



module.exports = router;
