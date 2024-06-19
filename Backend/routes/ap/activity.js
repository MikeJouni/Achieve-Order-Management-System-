var express = require('express');
var router = express.Router();
const activityController = require('../../controllers/ap/activity');


//  Routes & Functions

// router.post("/create", activityController.createActivity);
// router.patch("/update", activityController.updateActivity);
// router.delete("/delete/:activityId", activityController.deleteActivity);
// router.get("/get-one/:activityId", activityController.getOneActivity);
// router.get("/get-all", activityController.getAllActivities);
// router.get("/get-by-company/:companyId", activityController.getActivitiesCompany);
router.get("/get-by-company-and-filter", activityController.getActivitiesCompanyAndFilter);


module.exports = router;
