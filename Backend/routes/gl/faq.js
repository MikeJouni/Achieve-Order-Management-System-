var express = require('express');
var router = express.Router();
const faqController = require('../../controllers/gl/faq');


//  Routes & Functions

router.post("/create", faqController.createFaq);
router.patch("/update", faqController.updateFaq);
router.delete("/delete/:faqId", faqController.deleteFaq);
router.get("/get-one/:faqId", faqController.getOneFaq);
router.get("/get-all", faqController.getAllFaqs);
router.get("/get-by-company/:companyId", faqController.getFaqsByCompany);
router.get("/get-by-filter-web", faqController.getFaqsByFilterWeb);
router.get("/get-all-sorted", faqController.getAllFaqsSorted);
router.patch("/update-sort-numbers", faqController.updateFaqSortNumbers);


// =====================================================
// Website APIs

router.get("/get-all-of-gl", faqController.getAllFaqsOfGL);


module.exports = router;
