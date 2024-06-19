var express = require('express');
var router = express.Router();
const orderController = require('../../controllers/gl/order');


//  Routes & Functions

router.post("/create", orderController.createOrder);
router.patch("/update-status", orderController.updateOrderStatus);
router.delete("/delete/:orderId", orderController.deleteOrder);
router.get("/get-detail/:orderId", orderController.getOrderDetail);
router.patch("/cancel-re-cancel", orderController.cancelReCancelOrder);
// router.get("/get-by-status/:orderStatus", orderController.getOrdersByStatus);
router.get("/get-by-customer/:customerId", orderController.getOrdersByCustomer);
router.get("/get-by-driver/:driverId", orderController.getOrdersByDriver);
router.get("/get-by-company-and-date", orderController.getOrdersByCompanyAndDate);
router.get("/get-by-company-date-and-filter", orderController.getByCompanyDateAndFilter);
router.get("/get-by-filter-web", orderController.getOrdersByFilterWeb);


module.exports = router;
