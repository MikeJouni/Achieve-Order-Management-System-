const http_status_codes = require("http-status-codes");
const { Activity } = require("../../database.js");
const { Op } = require("sequelize");
const moment = require("moment");


module.exports = {


    async createActivity(req, res, next) {
        try {
            const {
                collectedPaymentId,
                companyId,
                customerId,
                driverId,
                employeeId,
                orderId,
                stockId,
                storePaymentId,
                type,
            } = req.body;

            const createActivity = await Activity.create({
                collectedPaymentId: collectedPaymentId,
                companyId: companyId,
                customerId: customerId,
                driverId: driverId,
                employeeId: employeeId,
                orderId: orderId,
                stockId: stockId,
                storePaymentId: storePaymentId,
                type: type,
            });

            return res.status(http_status_codes.StatusCodes.CREATED).json({
                statusCode: http_status_codes.StatusCodes.CREATED,
                isSuccess: true,
                message: "Activity created successfully!",
                activity: createActivity,
            });


        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in creating Activity!",
                error: error,
            });

        }
    },


    async updateActivity(req, res, next) {
        try {

            const {
                id,
                collectedPaymentId,
                companyId,
                customerId,
                driverId,
                employeeId,
                orderId,
                stockId,
                storePaymentId,
                type,
            } = req.body;

            const updatedActivity = await Activity.update(
                {
                    collectedPaymentId: collectedPaymentId,
                    companyId: companyId,
                    customerId: customerId,
                    driverId: driverId,
                    employeeId: employeeId,
                    orderId: orderId,
                    stockId: stockId,
                    storePaymentId: storePaymentId,
                    type: type,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );

            if (updatedActivity[0]) {

                const foundActivity = await Activity.findOne({
                    where: {
                        id: id,
                    },
                });

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "Activity updated successfully!",
                    activity: foundActivity,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "Activity data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating Activity!",
                error: error,
            });

        }
    },


    async deleteActivity(req, res, next) {
        try {

            const activityId = req.params.activityId;

            const deletedActivity = await Activity.destroy({
                where: {
                    id: activityId,
                },
            });

            if (deletedActivity) {

                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    statusCode: http_status_codes.StatusCodes.ACCEPTED,
                    isSuccess: true,
                    message: "Activity deleted successfully!",
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "Activity data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in deleting Activity!",
                error: error,
            });

        }
    },


    async getOneActivity(req, res, next) {
        try {

            const activityId = req.params.activityId;

            const oneActivity = await Activity.findOne({
                where: {
                    id: activityId,
                },
            });

            if (oneActivity) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "One Activity data fetched successfully!",
                    activity: oneActivity,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "One Activity data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting one Activity!",
                error: error,
            });

        }
    },


    async getAllActivities(req, res, next) {
        try {

            const allActivities = await Activity.findAll({
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "All Activities data fetched successfully!",
                activities: allActivities,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting All Activities!",
                error: error,
            });

        }
    },


    async getActivitiesCompany(req, res, next) {
        try {

            const companyId = req.params.companyId;

            const activitiesByCompany = await Activity.findAll({
                where: {
                    companyId: companyId,
                },
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "Activities by Company data fetched successfully!",
                activities: activitiesByCompany,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting Activities by Company!",
                error: error,
            });

        }
    },



    async getActivitiesCompanyAndFilter(req, res, next) {
        try {

            const {
                companyId,
                month,
                year,
                type,
            } = req.query;

            var activitiesList = [];

            if (type == 'year') {

                const fromDateFormatted = moment(year).startOf('year').toDate();
                const toDateFormatted = moment(year).endOf('year').toDate();

                activitiesList = await Activity.findAll({
                    where: {
                        companyId: companyId,
                        createdAt: {
                            [Op.between]: [fromDateFormatted, toDateFormatted],
                        },
                    },
                });

            } else if (type == 'month') {

                const monthYear = `${year}-${month}-01`
                const fromDateFormatted = moment(monthYear).startOf('month').toDate();
                const toDateFormatted = moment(monthYear).endOf('month').toDate();

                activitiesList = await Activity.findAll({
                    where: {
                        companyId: companyId,
                        createdAt: {
                            [Op.between]: [fromDateFormatted, toDateFormatted],
                        },
                    },
                });

            }


            return res.status(http_status_codes.StatusCodes.OK).json({
                status_code: http_status_codes.StatusCodes.OK,
                status: "success",
                message: "Activities by Company and Filter data fetched successfully!",
                activities: activitiesList,
            });

        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    status_code: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                    status: "error",
                    message: "Error occurred in getting Activities by Company and Filter!",
                    error: error,
                });
        }
    },



}