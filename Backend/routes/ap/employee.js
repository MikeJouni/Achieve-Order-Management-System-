var express = require('express');
var router = express.Router();
const employeeController = require('../../controllers/ap/employee');
const { multerUploadRoute } = require('../../services/utils');


//  Routes & Functions

router.post("/create", employeeController.createEmployee);
router.patch("/update", employeeController.updateEmployee);
router.post("/update-profile-photo/:employeeId", multerUploadRoute, employeeController.updateProfilePhoto);
router.post("/login", employeeController.loginEmployee);
router.post("/email-verification-code", employeeController.emailVerificationCodeEmployee);
router.patch("/change-password", employeeController.changePassword);
router.patch("/update-password", employeeController.updatePassword);
router.delete("/delete/:employeeId", employeeController.deleteEmployee);
router.get("/get-one/:employeeId", employeeController.getOneEmployee);
router.get("/get-all", employeeController.getAllEmployees);
router.get("/get-by-company/:companyId", employeeController.getEmployeesByCompany);


module.exports = router;
