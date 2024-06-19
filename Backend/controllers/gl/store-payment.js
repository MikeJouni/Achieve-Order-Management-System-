const http_status_codes = require("http-status-codes");
const { StorePayment, Order, OrderItem } = require("../../database.js");
const { createActivity } = require("../../services/activity.js");
const sequelize = require("sequelize");
const { isValueNotNull, paginationFiltrationWeb } = require("../../services/utils.js");
const { Op } = require("sequelize");

module.exports = {


    async createStorePayment(req, res, next) {
        try {
            const {
                amount,
                detail,
                isPaid,
                companyId,
            } = req.body;

            const createStorePayment = await StorePayment.create({
                amount: amount,
                detail: detail,
                isPaid: isPaid,
                companyId: companyId,
            });

            await createActivity({
                collectedPaymentId: null,
                companyId: companyId,
                customerId: null,
                driverId: null,
                employeeId: null,
                orderId: null,
                stockId: null,
                storePaymentId: createStorePayment.id,
                type: 'admin-created-store-payment',
            });


            const storePaymentsTotalByCompany = await StorePayment.findAll({
                where: {
                    companyId: companyId,
                },
                attributes: [
                    [sequelize.fn('sum', sequelize.col('amount')), 'amount'],
                ],
            });

            function parseDataReturn(data) {
                return data[0].amount ? parseInt(data[0].amount) : 0
            }

            return res.status(http_status_codes.StatusCodes.CREATED).json({
                statusCode: http_status_codes.StatusCodes.CREATED,
                isSuccess: true,
                message: "StorePayment created successfully!",
                storePayment: createStorePayment,
                storePaymentsAmount: parseDataReturn(storePaymentsTotalByCompany),
            });


        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in creating StorePayment!",
                error: error,
            });

        }
    },


    async updateStorePayment(req, res, next) {
        try {

            const {
                id,
                amount,
                detail,
                isPaid,
                companyId,
            } = req.body;

            const updatedStorePayment = await StorePayment.update(
                {
                    amount: amount,
                    detail: detail,
                    isPaid: isPaid,
                    companyId: companyId,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );

            if (updatedStorePayment[0]) {

                await createActivity({
                    collectedPaymentId: null,
                    companyId: companyId,
                    customerId: null,
                    driverId: null,
                    employeeId: null,
                    orderId: null,
                    stockId: null,
                    storePaymentId: id,
                    type: 'admin-updated-store-payment',
                });

                const foundStorePayment = await StorePayment.findOne({
                    where: {
                        id: id,
                    },
                });


                const storePaymentsTotalByCompany = await StorePayment.findAll({
                    where: {
                        companyId: companyId,
                    },
                    attributes: [
                        [sequelize.fn('sum', sequelize.col('amount')), 'amount'],
                    ],
                });

                function parseDataReturn(data) {
                    return data[0].amount ? parseInt(data[0].amount) : 0
                }

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "StorePayment updated successfully!",
                    storePayment: foundStorePayment,
                    storePaymentsAmount: parseDataReturn(storePaymentsTotalByCompany),
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "StorePayment data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating StorePayment!",
                error: error,
            });

        }
    },


    async deleteStorePayment(req, res, next) {
        try {

            const storePaymentId = req.params.storePaymentId;

            const myStorePayment = await StorePayment.findOne({
                where: {
                    id: storePaymentId,
                },
                attributes: ['companyId'],
            });

            await createActivity({
                collectedPaymentId: null,
                companyId: myStorePayment.companyId,
                customerId: null,
                driverId: null,
                employeeId: null,
                orderId: null,
                stockId: null,
                storePaymentId: storePaymentId,
                type: 'admin-deleted-store-payment',
            });

            const deletedStorePayment = await StorePayment.destroy({
                where: {
                    id: storePaymentId,
                },
            });

            if (deletedStorePayment) {

                const storePaymentsTotalByCompany = await StorePayment.findAll({
                    where: {
                        companyId: myStorePayment.companyId,
                    },
                    attributes: [
                        [sequelize.fn('sum', sequelize.col('amount')), 'amount'],
                    ],
                });

                function parseDataReturn(data) {
                    return data[0].amount ? parseInt(data[0].amount) : 0
                }

                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    statusCode: http_status_codes.StatusCodes.ACCEPTED,
                    isSuccess: true,
                    message: "StorePayment deleted successfully!",
                    storePaymentsAmount: parseDataReturn(storePaymentsTotalByCompany),
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "StorePayment data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in deleting StorePayment!",
                error: error,
            });

        }
    },


    async getAllStorePayments(req, res, next) {
        try {

            const allStorePayments = await StorePayment.findAll({
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "All StorePayments data fetched successfully!",
                storePayments: allStorePayments,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting All StorePayments!",
                error: error,
            });

        }
    },


    async getOneStorePayment(req, res, next) {
        try {

            const storePaymentId = req.params.storePaymentId;

            const oneStorePayment = await StorePayment.findOne({
                where: {
                    id: storePaymentId,
                },
            });

            if (oneStorePayment) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "One StorePayment data fetched successfully!",
                    storePayment: oneStorePayment,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "One StorePayment data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting one StorePayment!",
                error: error,
            });

        }
    },


    async getStorePaymentsByCompany(req, res, next) {
        try {

            const companyId = req.params.companyId;

            const allStorePaymentsByCompany = await StorePayment.findAll({
                where: {
                    companyId: companyId,
                },
                order: [["createdAt", "DESC"]],
            });

            const storePaymentsTotalByCompany = await StorePayment.findAll({
                where: {
                    companyId: companyId,
                },
                attributes: [
                    [sequelize.fn('sum', sequelize.col('amount')), 'amount'],
                ],
            });

            function parseDataReturn(data) {
                return data[0].amount ? parseInt(data[0].amount) : 0
            }

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "All StorePayments by Company data fetched successfully!",
                storePayments: allStorePaymentsByCompany,
                storePaymentsAmount: parseDataReturn(storePaymentsTotalByCompany),
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting All StorePayments by Company!",
                error: error,
            });

        }
    },

    


    async getStorePaymentsByFilterWeb(req, res, next) {
        try {

            const {
                page,
                size,
                sort,
                order,
                search,
                companyId,
            } = req.query;

            var mySearch = {};
            var myCondition = {};

            if (isValueNotNull(companyId)) {
                myCondition['companyId'] = companyId;
            }

            if (isValueNotNull(search)) {
                mySearch = {
                    [Op.or]: [
                        {
                            amount: {
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            detail: {
                                [Op.like]: `%${search}`
                            }
                        },
                    ],
                }
            }

            const myWhere = { ...mySearch, ...myCondition };
            const storePaymentsCount = await StorePayment.count({ where: myWhere, });
            const pageFilterResult = paginationFiltrationWeb(req.query, storePaymentsCount, myWhere);
            const filteredStorePayments = await StorePayment.findAll(pageFilterResult.filter);

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "StorePayments by filter for web data fetched successfully!",
                storePayments: filteredStorePayments,
                pagination: pageFilterResult.pagination,
                next: pageFilterResult.next,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting StorePayments by filter for web!",
                error: error,
            });

        }
    },


    // async getPaidStorePaymentsByCompany(req, res, next) {
    //     try {

    //         const companyId = req.params.companyId;

    //         const paidStorePaymentsByCompany = await StorePayment.findAll({
    //             where: {
    //                 isPaid: true,
    //                 companyId: companyId,
    //             },
    //             order: [["createdAt", "DESC"]],
    //         });

    //         return res.status(http_status_codes.StatusCodes.OK).json({
    //             statusCode: http_status_codes.StatusCodes.OK,
    //             isSuccess: true,
    //             message: "Paid StorePayments by Company data fetched successfully!",
    //             storePayments: paidStorePaymentsByCompany,
    //         });

    //     } catch (error) {

    //         return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
    //             statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
    //             isSuccess: false,
    //             message: "Error occurred in getting Paid StorePayments by Company!",
    //             error: error,
    //         });

    //     }
    // },


    // async getUnpaidStorePaymentsByCompany(req, res, next) {
    //     try {

    //         const companyId = req.params.companyId;

    //         const unpaidStorePaymentsByCompany = await StorePayment.findAll({
    //             where: {
    //                 isPaid: false,
    //                 companyId: companyId,
    //             },
    //             order: [["createdAt", "DESC"]],
    //         });

    //         return res.status(http_status_codes.StatusCodes.OK).json({
    //             statusCode: http_status_codes.StatusCodes.OK,
    //             isSuccess: true,
    //             message: "Unpaid StorePayments by Company data fetched successfully!",
    //             storePayments: unpaidStorePaymentsByCompany,
    //         });

    //     } catch (error) {

    //         return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
    //             statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
    //             isSuccess: false,
    //             message: "Error occurred in getting Unpaid StorePayments by Company!",
    //             error: error,
    //         });

    //     }
    // },


}