const http_status_codes = require("http-status-codes");
const passwordHash = require("password-hash");
const { Customer, Stock, Category, Company } = require("../../database.js");
const { createActivity } = require("../../services/activity.js");
const { Op } = require("sequelize");
const { tokenCreator } = require("../../services/token.js");
const { gamingLabCompanyId, isValueNotNull, paginationFiltrationWeb, nodemailerTransporter } = require("../../services/utils.js");

module.exports = {


    async createCustomer(req, res, next) {
        try {
            const {
                name,
                email,
                password,
                phone,
                address,
                city,
                employeeId,
                companyId,
            } = req.body;

            const customerCountByEmail = await Customer.count({
                where: {
                    email: email,
                    companyId: companyId,
                }
            })

            if (customerCountByEmail) {

                return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                    statusCode: http_status_codes.StatusCodes.CONFLICT,
                    isSuccess: false,
                    message: "Email already used by another account!",
                });

            }

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

            }

            if (password.length < 6) {

                return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                    statusCode: http_status_codes.StatusCodes.CONFLICT,
                    isSuccess: false,
                    message: "Password must be minimum 6 characters long!",
                });

            }

            const createCustomer = await Customer.create({
                name: name,
                email: email,
                password: passwordHash.generate(password),
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
                type: employeeId ? 'employee-created-customer' : 'customer-created-customer',
            });

            return res.status(http_status_codes.StatusCodes.CREATED).json({
                statusCode: http_status_codes.StatusCodes.CREATED,
                isSuccess: true,
                message: "Customer created successfully!",
                customer: createCustomer,
            });

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
                email,
                password,
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

            const customerCountByEmail = await Customer.count({
                where: {
                    [Op.not]: {
                        id: id,
                    },
                    email: email,
                    companyId: myCustomer.companyId,
                }
            })

            if (customerCountByEmail) {

                return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                    statusCode: http_status_codes.StatusCodes.CONFLICT,
                    isSuccess: false,
                    message: "Email already used by another account!",
                });

            }

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

            }

            const updatedCustomer = await Customer.update(
                {
                    name: name,
                    email: email,
                    password: password,
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



    async getCustomersByFilterWeb(req, res, next) {
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
                            name: {
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            email: {
                                [Op.like]: `%${search}`
                            }
                        },
                        {
                            phone: {
                                [Op.like]: `%${search}`
                            }
                        },
                        {
                            address: {
                                [Op.like]: `%${search}`
                            }
                        },
                        {
                            city: {
                                [Op.like]: `%${search}`
                            }
                        },
                    ],
                }
            }

            const myWhere = { ...mySearch, ...myCondition };
            const customersCount = await Customer.count({ where: myWhere, });
            const pageFilterResult = paginationFiltrationWeb(req.query, customersCount, myWhere);
            const filteredCustomers = await Customer.findAll(pageFilterResult.filter);

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "Customers by filter for web data fetched successfully!",
                customers: filteredCustomers,
                pagination: pageFilterResult.pagination,
                next: pageFilterResult.next,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting Customers by filter for web!",
                error: error,
            });

        }
    },




    async updateCustomerBlock(req, res, next) {
        try {

            const {
                id,
                isBlocked,
            } = req.body;

            const updatedCustomer = await Customer.update(
                {
                    isBlocked: isBlocked,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );

            if (updatedCustomer[0]) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: `Customer ${isBlocked ? 'blocked' : 'unblocked'} successfully!`,
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
                message: "Error occurred in updating Customer block!",
                error: error,
            });

        }
    },



    // ===========================================================
    // Website APIs


    async registerCustomer(req, res, next) {
        try {
            const {
                name,
                email,
                phone,
                password,
                address,
                city,
            } = req.body;

            const customerCountByEmail = await Customer.count({
                where: {
                    email: email
                }
            })

            if (customerCountByEmail) {

                return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                    statusCode: http_status_codes.StatusCodes.CONFLICT,
                    isSuccess: false,
                    message: "Email already used by another account!",
                });

            }

            const customerCountByPhone = await Customer.count({
                where: {
                    phone: phone
                }
            })

            if (customerCountByPhone) {

                return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                    statusCode: http_status_codes.StatusCodes.CONFLICT,
                    isSuccess: false,
                    message: "Phone already used by another account!",
                });

            }


            if (password.length < 6) {

                return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                    statusCode: http_status_codes.StatusCodes.CONFLICT,
                    isSuccess: false,
                    message: "Password must be minimum 6 characters long!",
                });

            }

            const companyId = await gamingLabCompanyId();

            const registerCustomer = await Customer.create({
                name: name,
                email: email,
                phone: phone,
                password: passwordHash.generate(password),
                address: address,
                city: city,
                companyId: companyId,
            });

            const myCompany = await Company.findOne({
                where: {
                    id: companyId,
                },
                attributes: ['id', 'type'],
            })

            return res.status(http_status_codes.StatusCodes.CREATED).json({
                statusCode: http_status_codes.StatusCodes.CREATED,
                isSuccess: true,
                message: "Customer registered successfully!",
                customer: registerCustomer,
                company: myCompany,
                token: tokenCreator(email),
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in registering Customer!",
                error: error,
            });

        }
    },



    async updateCustomerData(req, res, next) {
        try {

            const {
                id,
                name,
                email,
                phone,
                // password,
                address,
                city,
            } = req.body;

            const customerCountByEmail = await Customer.count({
                where: {
                    [Op.not]: {
                        id: id,
                    },
                    email: email
                }
            })

            if (customerCountByEmail) {

                return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                    statusCode: http_status_codes.StatusCodes.CONFLICT,
                    isSuccess: false,
                    message: "Email already used by another account!",
                });

            }

            const customerCountByPhone = await Customer.count({
                where: {
                    [Op.not]: {
                        id: id,
                    },
                    phone: phone
                }
            })

            if (customerCountByPhone) {

                return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                    statusCode: http_status_codes.StatusCodes.CONFLICT,
                    isSuccess: false,
                    message: "Phone already used by another account!",
                });

            }

            const updatedCustomer = await Customer.update(
                {
                    name: name,
                    email: email,
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


        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating Customer!",
                error: error,
            });

        }
    },


    async loginCustomer(req, res, next) {
        try {
            const {
                email,
                password,
            } = req.body;

            const myCustomer = await Customer.findOne({
                where: {
                    email: email,
                }
            })

            if (myCustomer) {

                const myCompany = await Company.findOne({
                    where: {
                        id: myCustomer.companyId,
                    },
                    attributes: ['id', 'type'],
                })

                const verifyPassword = passwordHash.verify(password, myCustomer.password);

                if (verifyPassword) {

                    return res.status(http_status_codes.StatusCodes.OK).json({
                        statusCode: http_status_codes.StatusCodes.OK,
                        isSuccess: true,
                        message: "Customer logged in successfully!",
                        customer: myCustomer,
                        company: myCompany,
                        token: tokenCreator(myCustomer.email),
                    });

                } else {

                    return res.status(http_status_codes.StatusCodes.UNAUTHORIZED).json({
                        statusCode: http_status_codes.StatusCodes.UNAUTHORIZED,
                        isSuccess: false,
                        message: "Password is incorrect!",
                    });

                }

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "No Customer found against this email!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in logging in Customer!",
                error: error,
            });

        }
    },


    async emailVerificationCodeCustomer(req, res, next) {
        try {
            const {
                email,
            } = req.body;

            const myCustomer = await Customer.findOne({
                where: {
                    email: email,
                }
            })

            if (myCustomer) {

                const randomCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

                const mailOptions = {
                    from: "",
                    to: email,
                    subject: "Password Verification Code",
                    text: "Here is a code to reset your password.",
                    html: `
                    <h2>Hi,</h2>
                    </br>
                    <h3>You have requested to reset your password</h3>
                    <p>Here is your verification code to reset your password: </p>
                    </br></br>
                    <h1> Your code - ${randomCode} </h1>
                    </br>
                    <p>If you ignore this message, your password will not be changed.</p>
                    <h3>Best regards, Gaming LB</h3>
                    `,
                };

                nodemailerTransporter.sendMail(mailOptions, function (error, info) {
                    if (error) {

                        return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                            status_code: http_status_codes.StatusCodes.CONFLICT,
                            isSuccess: false,
                            message: "Something went wrong while sending Verification Code. Try again later!",
                            error: error,
                        });

                    } else {

                        return res.status(http_status_codes.StatusCodes.OK).json({
                            status_code: http_status_codes.StatusCodes.OK,
                            isSuccess: true,
                            message: "Verification code sent successfully!",
                            code: randomCode,
                            customer: myCustomer,
                        });

                    }
                });

            } else {

                return res.status(http_status_codes.StatusCodes.UNAUTHORIZED).json({
                    status_code: http_status_codes.StatusCodes.UNAUTHORIZED,
                    isSuccess: false,
                    message: "No Customer found against this email!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in Emailing Verification Code!",
                error: error,
            });

        }
    },



    async changePassword(req, res, next) {
        try {
            const {
                id,
                oldPassword,
                newPassword,
            } = req.body;

            const myCustomer = await Customer.findOne({
                where: {
                    id: id
                },
                attributes: ['password'],
            })

            if (myCustomer) {

                const verifyPassword = passwordHash.verify(oldPassword, myCustomer.password);

                if (verifyPassword) {

                    if (newPassword.length >= 6) {

                        await Customer.update(
                            {
                                password: passwordHash.generate(newPassword)
                            },
                            {
                                where: {
                                    id: id
                                }
                            }
                        )

                        return res.status(http_status_codes.StatusCodes.OK).json({
                            statusCode: http_status_codes.StatusCodes.OK,
                            isSuccess: true,
                            message: "Password changed successfully!",
                        });

                    } else {

                        return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                            statusCode: http_status_codes.StatusCodes.CONFLICT,
                            isSuccess: false,
                            message: "Password must be minimum 6 characters long!",
                        });

                    }

                } else {

                    return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                        statusCode: http_status_codes.StatusCodes.CONFLICT,
                        isSuccess: false,
                        message: "Old Password is incorrect!",
                    });

                }


            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "Customer not found!",
                });

            }

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in changing Password!",
                error: error,
            });
        }
    },


    async updatePassword(req, res, next) {
        try {
            const {
                id,
                password,
            } = req.body;


            const updatedCustomer = await Customer.update(
                {
                    password: passwordHash.generate(password)
                },
                {
                    where: {
                        id: id
                    }
                }
            )

            if (updatedCustomer[0]) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "Customer Password updated successfully!",
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
                message: "Error occurred in updating Customer Password!",
                error: error,
            });

        }
    },



    async getHomeDataOfGL(req, res, next) {
        try {

            const companyId = await gamingLabCompanyId();

            if (!companyId) {
                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: true,
                    message: "Gaming LB company not found!",
                });
            }

            const categoriesOfGL = await Category.findAll({
                where: {
                    companyId: companyId,
                },
                order: [["title", "ASC"]],
            });

            // ! TODO need to send trendy stocks
            const stocksOfGL = await Stock.findAll({
                where: {
                    companyId: companyId,
                },
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "Gaming LB Home data fetched successfully!",
                stocks: stocksOfGL,
                categories: categoriesOfGL,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting Gaming LB Home!",
                error: error,
            });

        }
    },



}