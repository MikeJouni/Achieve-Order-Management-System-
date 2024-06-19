const http_status_codes = require("http-status-codes");
const { CollectedPayment, Order, OrderItem } = require("../../database.js");
const { createActivity } = require("../../services/activity.js");
const { isValueNotNull, paginationFiltrationWeb } = require("../../services/utils.js");
const { Op } = require("sequelize");


module.exports = {


    async createCollectedPayment(req, res, next) {
        try {
            const {
                amount,
                amountType,
                date,
                description,
                companyId,
            } = req.body;

            const createCollectedPayment = await CollectedPayment.create({
                amount: amount,
                amountType: amountType,
                date: date,
                description: description,
                companyId: companyId,
            });

            await createActivity({
                collectedPaymentId: createCollectedPayment.id,
                companyId: companyId,
                customerId: null,
                driverId: null,
                employeeId: null,
                orderId: null,
                stockId: null,
                storePaymentId: null,
                type: 'admin-created-collected-payment',
            });

            return res.status(http_status_codes.StatusCodes.CREATED).json({
                statusCode: http_status_codes.StatusCodes.CREATED,
                isSuccess: true,
                message: "CollectedPayment created successfully!",
                collectedPayment: createCollectedPayment,
            });


        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in creating CollectedPayment!",
                error: error,
            });

        }
    },


    async updateCollectedPayment(req, res, next) {
        try {

            const {
                id,
                amount,
                amountType,
                date,
                description,
                companyId,
            } = req.body;

            const updatedCollectedPayment = await CollectedPayment.update(
                {
                    amount: amount,
                    amountType: amountType,
                    date: date,
                    description: description,
                    companyId: companyId,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );

            if (updatedCollectedPayment[0]) {


                await createActivity({
                    collectedPaymentId: id,
                    companyId: companyId,
                    customerId: null,
                    driverId: null,
                    employeeId: null,
                    orderId: null,
                    stockId: null,
                    storePaymentId: null,
                    type: 'admin-updated-collected-payment',
                });

                const foundCollectedPayment = await CollectedPayment.findOne({
                    where: {
                        id: id,
                    },
                });

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "CollectedPayment updated successfully!",
                    collectedPayment: foundCollectedPayment,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "CollectedPayment data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating CollectedPayment!",
                error: error,
            });

        }
    },


    async deleteCollectedPayment(req, res, next) {
        try {

            const collectedPaymentId = req.params.collectedPaymentId;

            const myCollectedPayment = await CollectedPayment.findOne({
                where: {
                    id: collectedPaymentId,
                },
                attributes: ['companyId'],
            })

            await createActivity({
                collectedPaymentId: collectedPaymentId,
                companyId: myCollectedPayment.companyId,
                customerId: null,
                driverId: null,
                employeeId: null,
                orderId: null,
                stockId: null,
                storePaymentId: null,
                type: 'admin-deleted-collected-payment',
            });

            const deletedCollectedPayment = await CollectedPayment.destroy({
                where: {
                    id: collectedPaymentId,
                },
            });

            if (deletedCollectedPayment) {

                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    statusCode: http_status_codes.StatusCodes.ACCEPTED,
                    isSuccess: true,
                    message: "CollectedPayment deleted successfully!",
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "CollectedPayment data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in deleting CollectedPayment!",
                error: error,
            });

        }
    },


    async getOneCollectedPayment(req, res, next) {
        try {

            const collectedPaymentId = req.params.collectedPaymentId;

            const oneCollectedPayment = await CollectedPayment.findOne({
                where: {
                    id: collectedPaymentId,
                },
            });

            if (oneCollectedPayment) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "One CollectedPayment data fetched successfully!",
                    collectedPayment: oneCollectedPayment,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "One CollectedPayment data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting one CollectedPayment!",
                error: error,
            });

        }
    },

    async getAllCollectedPayments(req, res, next) {
        try {

            const allCollectedPayments = await CollectedPayment.findAll({
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "All CollectedPayments data fetched successfully!",
                collectedPayments: allCollectedPayments,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting All CollectedPayments!",
                error: error,
            });

        }
    },


    async getCollectedPaymentsByCompany(req, res, next) {
        try {

            const companyId = req.params.companyId;

            const allCollectedPaymentsByCompany = await CollectedPayment.findAll({
                where: {
                    companyId: companyId,
                },
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "All CollectedPayments by Company data fetched successfully!",
                collectedPayments: allCollectedPaymentsByCompany,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting All CollectedPayments by Company!",
                error: error,
            });

        }
    },




    async getCollectedPaymentsByFilterWeb(req, res, next) {
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
                            date: {
                                [Op.like]: `%${search}`
                            }
                        },
                        {
                            description: {
                                [Op.like]: `%${search}`
                            }
                        },
                        {
                            amountType: {
                                [Op.like]: `%${search}`
                            }
                        },
                    ],
                }
            }

            const myWhere = { ...mySearch, ...myCondition };
            const collectedPaymentsCount = await CollectedPayment.count({ where: myWhere, });
            const pageFilterResult = paginationFiltrationWeb(req.query, collectedPaymentsCount, myWhere);
            const filteredCollectedPayments = await CollectedPayment.findAll(pageFilterResult.filter);

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "CollectedPayments by filter for web data fetched successfully!",
                collectedPayments: filteredCollectedPayments,
                pagination: pageFilterResult.pagination,
                next: pageFilterResult.next,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting CollectedPayments by filter for web!",
                error: error,
            });

        }
    },



}