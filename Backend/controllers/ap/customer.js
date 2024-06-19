const http_status_codes = require("http-status-codes");
const { Customer } = require("../../database.js");
const { createActivity } = require("../../services/activity.js");
const { Op } = require("sequelize");

module.exports = {


    async createCustomer(req, res, next) {
        try {
            const {
                name,
                // email,
                // password,
                phone,
                address,
                city,
                employeeId,
                companyId,
            } = req.body;

            const customerCountByPhone = await Customer.count({
                where: {
                    phone: phone,
                    companyId: companyId,
                }
            })

            if (customerCountByPhone) {

                return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                    statusCode: http_status_codes.StatusCodes.CONFLICT,
                    isSuccess: false,
                    message: "Phone already used by another account!",
                });

            } else {

                const createCustomer = await Customer.create({
                    name: name,
                    // email: email,
                    // password: password,
                    phone: phone,
                    address: address,
                    city: city,
                    companyId: companyId,
                });


                await createActivity({
                    collectedPaymentId: null,
                    companyId: companyId,
                    customerId: createCustomer.id,
                    driverId: null,
                    employeeId: employeeId,
                    orderId: null,
                    stockId: null,
                    storePaymentId: null,
                    type: employeeId ? 'employee-created-customer' : 'admin-created-customer',
                });

                return res.status(http_status_codes.StatusCodes.CREATED).json({
                    statusCode: http_status_codes.StatusCodes.CREATED,
                    isSuccess: true,
                    message: "Customer created successfully!",
                    customer: createCustomer,
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in creating Customer!",
                error: error,
            });

        }
    },


    async updateCustomer(req, res, next) {
        try {

            const {
                id,
                name,
                // email,
                // password,
                phone,
                address,
                city,
            } = req.body;

            const myCustomer = await Customer.findOne({
                where: {
                    id: id,
                },
                attributes: ['companyId']
            })

            const customerCountByPhone = await Customer.count({
                where: {
                    [Op.not]: {
                        id: id,
                    },
                    phone: phone,
                    companyId: myCustomer.companyId,
                }
            })

            if (customerCountByPhone) {

                return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                    statusCode: http_status_codes.StatusCodes.CONFLICT,
                    isSuccess: false,
                    message: "Phone already used by another account!",
                });

            } else {

                const updatedCustomer = await Customer.update(
                    {
                        name: name,
                        // email: email,
                        // password: password,
                        phone: phone,
                        address: address,
                        city: city,
                    },
                    {
                        where: {
                            id: id,
                        },
                    }
                );

                if (updatedCustomer[0]) {

                    const foundCustomer = await Customer.findOne({
                        where: {
                            id: id,
                        },
                    });

                    return res.status(http_status_codes.StatusCodes.OK).json({
                        statusCode: http_status_codes.StatusCodes.OK,
                        isSuccess: true,
                        message: "Customer updated successfully!",
                        customer: foundCustomer,
                    });

                } else {

                    return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                        statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                        isSuccess: false,
                        message: "Customer data not found!",
                    });

                }

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating Customer!",
                error: error,
            });

        }
    },


    async deleteCustomer(req, res, next) {
        try {

            const customerId = req.params.customerId;

            const deletedCustomer = await Customer.destroy({
                where: {
                    id: customerId,
                },
            });

            if (deletedCustomer) {

                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    statusCode: http_status_codes.StatusCodes.ACCEPTED,
                    isSuccess: true,
                    message: "Customer deleted successfully!",
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "Customer data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in deleting Customer!",
                error: error,
            });

        }
    },


    async getOneCustomer(req, res, next) {
        try {

            const customerId = req.params.customerId;

            const oneCustomer = await Customer.findOne({
                where: {
                    id: customerId,
                },
            });

            if (oneCustomer) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "One Customer data fetched successfully!",
                    customer: oneCustomer,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "One Customer data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting one Customer!",
                error: error,
            });

        }
    },


    async getAllCustomers(req, res, next) {
        try {

            const allCustomers = await Customer.findAll({
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "All Customers data fetched successfully!",
                customers: allCustomers,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting All Customers!",
                error: error,
            });

        }
    },


    async getCustomersByCompany(req, res, next) {
        try {

            const companyId = req.params.companyId;

            const customersByCompany = await Customer.findAll({
                where: {
                    companyId: companyId,
                },
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "Customers by Company data fetched successfully!",
                customers: customersByCompany,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting Customers by Company!",
                error: error,
            });

        }
    },


}