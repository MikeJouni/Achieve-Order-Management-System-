const http_status_codes = require("http-status-codes");
const { CustomerDebt, Order, OrderItem, Customer } = require("../../database.js");
const { createActivity } = require("../../services/activity.js");
const sequelize = require("sequelize");


module.exports = {


    async createCustomerDebt(req, res, next) {
        try {
            const {
                amount,
                date,
                description,
                companyId,
                customerId,
                // orderId,
                employeeId,
            } = req.body;

            const createCustomerDebt = await CustomerDebt.create({
                amount: amount,
                date: date,
                description: description,
                companyId: companyId,
                customerId: customerId,
                // orderId: orderId,
            });


            const customerDebtsTotalByCompany = await CustomerDebt.findAll({
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

            await createActivity({
                collectedPaymentId: null,
                companyId: companyId,
                customerId: customerId,
                customerDebtId: createCustomerDebt.id,
                driverId: null,
                employeeId: employeeId,
                orderId: null,
                stockId: null,
                storePaymentId: null,
                type: employeeId ? 'employee-created-customer-debt' : 'admin-created-customer-debt',
            });

            return res.status(http_status_codes.StatusCodes.CREATED).json({
                statusCode: http_status_codes.StatusCodes.CREATED,
                isSuccess: true,
                message: "CustomerDebt created successfully!",
                customerDebt: createCustomerDebt,
                customerDebtsAmount: parseDataReturn(customerDebtsTotalByCompany),
            });


        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in creating CustomerDebt!",
                error: error,
            });

        }
    },


    async updateCustomerDebt(req, res, next) {
        try {

            const {
                id,
                amount,
                date,
                description,
                companyId,
                customerId,
                // orderId,
                employeeId,
            } = req.body;

            const updatedCustomerDebt = await CustomerDebt.update(
                {
                    amount: amount,
                    date: date,
                    description: description,
                    companyId: companyId,
                    customerId: customerId,
                    // orderId: orderId,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );

            if (updatedCustomerDebt[0]) {

                await createActivity({
                    collectedPaymentId: null,
                    companyId: companyId,
                    customerId: customerId,
                    driverId: null,
                    employeeId: employeeId,
                    orderId: null,
                    stockId: null,
                    storePaymentId: null,
                    customerDebtId: id,
                    type: employeeId ? 'employee-created-customer-debt' : 'admin-created-customer-debt',
                });

                const foundCustomerDebt = await CustomerDebt.findOne({
                    where: {
                        id: id,
                    },
                });

                const customerDebtsTotalByCompany = await CustomerDebt.findAll({
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
                    message: "CustomerDebt updated successfully!",
                    customerDebt: foundCustomerDebt,
                    customerDebtsAmount: parseDataReturn(customerDebtsTotalByCompany),
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "CustomerDebt data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating CustomerDebt!",
                error: error,
            });

        }
    },


    async deleteCustomerDebt(req, res, next) {
        try {

            const customerDebtId = req.params.customerDebtId;

            const myCustomerDebt = await CustomerDebt.findOne({
                where: {
                    id: customerDebtId,
                },
                attributes: ['companyId', 'customerId'],
            });

            await createActivity({
                collectedPaymentId: null,
                companyId: myCustomerDebt.companyId,
                customerId: myCustomerDebt.customerId,
                customerDebtId: customerDebtId,
                driverId: null,
                employeeId: null,
                orderId: null,
                stockId: null,
                storePaymentId: null,
                type: 'admin-deleted-customer-debt',
            });

            const deletedCustomerDebt = await CustomerDebt.destroy({
                where: {
                    id: customerDebtId,
                },
            });

            if (deletedCustomerDebt) {

                const customerDebtsTotalByCompany = await CustomerDebt.findAll({
                    where: {
                        companyId: myCustomerDebt.companyId,
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
                    message: "CustomerDebt deleted successfully!",

                    customerDebtsAmount: parseDataReturn(customerDebtsTotalByCompany),
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "CustomerDebt data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in deleting CustomerDebt!",
                error: error,
            });

        }
    },


    async getOneCustomerDebt(req, res, next) {
        try {

            const customerDebtId = req.params.customerDebtId;

            const oneCustomerDebt = await CustomerDebt.findOne({
                where: {
                    id: customerDebtId,
                },
            });

            if (oneCustomerDebt) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "One CustomerDebt data fetched successfully!",
                    customerDebt: oneCustomerDebt,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "One CustomerDebt data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting one CustomerDebt!",
                error: error,
            });

        }
    },


    async getAllCustomerDebts(req, res, next) {
        try {

            const allCustomerDebts = await CustomerDebt.findAll({
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "All CustomerDebts data fetched successfully!",
                customerDebts: allCustomerDebts,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting All CustomerDebts!",
                error: error,
            });

        }
    },

    async getCustomerDebtsByCompany(req, res, next) {
        try {

            const companyId = req.params.companyId;

            const allCustomerDebtsByCompany = await CustomerDebt.findAll({
                where: {
                    companyId: companyId,
                },
                include: {
                    model: Customer,
                    attributes: [],
                },
                attributes: {
                    include: [
                        [sequelize.col('customer.name'), 'customerName']
                    ]
                },
                order: [["createdAt", "DESC"]],
            });

            const customerDebtsTotalByCompany = await CustomerDebt.findAll({
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
                message: "All CustomerDebts by Company data fetched successfully!",
                customerDebts: allCustomerDebtsByCompany,
                customerDebtsAmount: parseDataReturn(customerDebtsTotalByCompany),
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting All CustomerDebts by Company!",
                error: error,
            });

        }
    },



}