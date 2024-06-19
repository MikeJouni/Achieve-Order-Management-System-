const http_status_codes = require("http-status-codes");
const { Driver } = require("../../database.js");
const { createActivity } = require("../../services/activity.js");


module.exports = {


    async createDriver(req, res, next) {
        try {
            const {
                name,
                phone,
                address,
                city,
                barcode,
                employeeId,
                companyId,
            } = req.body;

            const createDriver = await Driver.create({
                name: name,
                phone: phone,
                address: address,
                city: city,
                barcode: barcode,
                companyId: companyId,
            });

            await createActivity({
                collectedPaymentId: null,
                companyId: companyId,
                customerId: null,
                driverId: createDriver.id,
                employeeId: employeeId,
                orderId: null,
                stockId: null,
                storePaymentId: null,
                type: employeeId ? 'employee-created-driver' : 'admin-created-driver',
            });

            return res.status(http_status_codes.StatusCodes.CREATED).json({
                statusCode: http_status_codes.StatusCodes.CREATED,
                isSuccess: true,
                message: "Driver created successfully!",
                driver: createDriver,
            });


        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in creating Driver!",
                error: error,
            });

        }
    },


    async updateDriver(req, res, next) {
        try {

            const {
                id,
                name,
                phone,
                address,
                city,
                barcode,
                companyId,
            } = req.body;

            const updatedDriver = await Driver.update(
                {
                    name: name,
                    phone: phone,
                    address: address,
                    city: city,
                    barcode: barcode,
                    companyId: companyId,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );

            if (updatedDriver[0]) {

                const foundDriver = await Driver.findOne({
                    where: {
                        id: id,
                    },
                });

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "Driver updated successfully!",
                    driver: foundDriver,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "Driver data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating Driver!",
                error: error,
            });

        }
    },


    async deleteDriver(req, res, next) {
        try {

            const driverId = req.params.driverId;

            const deletedDriver = await Driver.destroy({
                where: {
                    id: driverId,
                },
            });

            if (deletedDriver) {

                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    statusCode: http_status_codes.StatusCodes.ACCEPTED,
                    isSuccess: true,
                    message: "Driver deleted successfully!",
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "Driver data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in deleting Driver!",
                error: error,
            });

        }
    },


    async getOneDriver(req, res, next) {
        try {

            const driverId = req.params.driverId;

            const oneDriver = await Driver.findOne({
                where: {
                    id: driverId,
                },
            });

            if (oneDriver) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "One Driver data fetched successfully!",
                    driver: oneDriver,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "One Driver data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting one Driver!",
                error: error,
            });

        }
    },


    async getAllDrivers(req, res, next) {
        try {

            const allDrivers = await Driver.findAll({
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "All Drivers data fetched successfully!",
                drivers: allDrivers,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting All Drivers!",
                error: error,
            });

        }
    },


    async getDriversByCompany(req, res, next) {
        try {

            const companyId = req.params.companyId;

            const driversByCompany = await Driver.findAll({
                where: {
                    companyId: companyId,
                },
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "Drivers by Company data fetched successfully!",
                drivers: driversByCompany,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting Drivers by Company!",
                error: error,
            });

        }
    },


}