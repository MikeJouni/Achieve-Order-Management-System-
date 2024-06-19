var express = require('express');
var router = express.Router();
const driverController = require('../../controllers/gl/driver');


//  Routes & Functions

router.post("/create", driverController.createDriver);
router.patch("/update", driverController.updateDriver);
router.delete("/delete/:driverId", driverController.deleteDriver);
router.get("/get-one/:driverId", driverController.getOneDriver);
router.get("/get-all", driverController.getAllDrivers);
router.get("/get-by-company/:companyId", driverController.getDriversByCompany);
router.get("/get-by-filter-web", driverController.getDriversByFilterWeb);


module.exports = router;
