const http_status_codes = require("http-status-codes");
const { Employee, Company } = require("../../database");
const passwordHash = require("password-hash");
const { fileRemover, multerFileUploader, randomNumbersGenerator, nodemailerTransporter, isValueNotNull, paginationFiltrationWeb } = require('../../services/utils');
const { tokenCreator } = require("../../services/token");
const { createActivity } = require("../../services/activity");
const moment = require("moment");
const { Op } = require("sequelize");

module.exports = {


    async createEmployee(req, res, next) {
        try {
            const {
                name,
                email,
                password,
                companyId,
            } = req.body;

            const employeeCountByEmail = await Employee.count({
                where: {
                    email: email
                }
            })

            if (employeeCountByEmail) {

                return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                    statusCode: http_status_codes.StatusCodes.CONFLICT,
                    isSuccess: false,
                    message: "Email already used by another account!",
                });

            } else {

                if (password.length >= 6) {

                    const createEmployee = await Employee.create({
                        name: name,
                        email: email,
                        password: passwordHash.generate(password),
                        companyId: companyId,
                    });


                    // await createActivity({
                    //     collectedPaymentId: null,
                    //     companyId: companyId,
                    //     customerId: null,
                    //     driverId: null,
                    //     employeeId: createEmployee.id,
                    //     orderId: null,
                    //     stockId: null,
                    //     storePaymentId: null,
                    //     type: 'admin-created-employee',
                    // });

                    return res.status(http_status_codes.StatusCodes.CREATED).json({
                        statusCode: http_status_codes.StatusCodes.CREATED,
                        isSuccess: true,
                        message: "Employee created successfully!",
                        employee: createEmployee,
                    });

                } else {

                    return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                        statusCode: http_status_codes.StatusCodes.CONFLICT,
                        isSuccess: false,
                        message: "Password must be minimum 6 characters long!",
                    });

                }

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in creating Employee!",
                error: error,
            });

        }
    },



    async updateEmployee(req, res, next) {
        try {

            const {
                id,
                name,
                email,
                companyId,
            } = req.body;

            const employeeCountByEmail = await Employee.count({
                where: {
                    [Op.not]: {
                        id: id,
                    },
                    email: email,
                }
            })

            if (employeeCountByEmail) {

                return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                    statusCode: http_status_codes.StatusCodes.CONFLICT,
                    isSuccess: false,
                    message: "Email already used by another account!",
                });

            } else {

                const updatedEmployee = await Employee.update(
                    {
                        name: name,
                        email: email,
                        companyId: companyId,
                    },
                    {
                        where: {
                            id: id,
                        },
                    }
                );

                if (updatedEmployee[0]) {

                    const foundEmployee = await Employee.findOne({
                        where: {
                            id: id,
                        },
                    });

                    return res.status(http_status_codes.StatusCodes.OK).json({
                        statusCode: http_status_codes.StatusCodes.OK,
                        isSuccess: true,
                        message: "Employee updated successfully!",
                        employee: foundEmployee,
                    });

                } else {

                    return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                        statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                        isSuccess: false,
                        message: "Employee data not found!",
                    });

                }

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating Employee!",
                error: error,
            });

        }
    },



    async updateProfilePhoto(req, res, next) {
        try {

            const employeeId = req.params.employeeId;

            const myEmployee = await Employee.findOne({
                where: {
                    id: employeeId
                },
                attributes: ['profilePhoto']
            })

            if (myEmployee) {

                const fileUploadResult = await multerFileUploader(req.file);

                if (fileUploadResult) {

                    await Employee.update(
                        {
                            profilePhoto: fileUploadResult,
                        },
                        {
                            where: {
                                id: employeeId,
                            },
                        }
                    );

                    if (myEmployee.profilePhoto) {
                        fileRemover(myEmployee.profilePhoto)
                    }

                    const foundEmployee = await Employee.findOne({
                        where: {
                            id: employeeId,
                        },
                    });

                    return res.status(http_status_codes.StatusCodes.OK).json({
                        statusCode: http_status_codes.StatusCodes.OK,
                        isSuccess: true,
                        message: "Employee ProfilePhoto updated successfully!",
                        employee: foundEmployee,
                    });

                } else {

                    return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                        statusCode: http_status_codes.StatusCodes.CONFLICT,
                        isSuccess: false,
                        message: "Error occurred in uploading ProfilePhoto!",
                    });

                }


            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "Employee data not found!",
                });

            }


        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating Employee ProfilePhoto!",
                error: error,
            });

        }
    },



    async loginEmployee(req, res, next) {
        try {
            const {
                email,
                password,
            } = req.body;

            const myEmployee = await Employee.findOne({
                where: {
                    email: email,
                }
            })

            if (myEmployee) {

                const myCompany = await Company.findOne({
                    where: {
                        id: myEmployee.companyId,
                    },
                    attributes: ['id', 'licenseExpiryDate', 'isDeleted', 'type'],
                })

                if (!myCompany.isDeleted) {

                    var notExpiredLicenseCondition = null;

                    if (myCompany.licenseExpiryDate) {
                        const companyLicenseDate = moment(myCompany.licenseExpiryDate).endOf('day');
                        const todayDate = moment().endOf('day');
                        notExpiredLicenseCondition = todayDate <= companyLicenseDate;
                    } else {
                        notExpiredLicenseCondition = false;
                    }

                    if (notExpiredLicenseCondition) {

                        const verifyPassword = passwordHash.verify(password, myEmployee.password);

                        if (verifyPassword) {

                            return res.status(http_status_codes.StatusCodes.OK).json({
                                statusCode: http_status_codes.StatusCodes.OK,
                                isSuccess: true,
                                message: "Employee logged in successfully!",
                                employee: myEmployee,
                                company: myCompany,
                                token: tokenCreator(myEmployee.email),
                            });

                        } else {

                            return res.status(http_status_codes.StatusCodes.UNAUTHORIZED).json({
                                statusCode: http_status_codes.StatusCodes.UNAUTHORIZED,
                                isSuccess: false,
                                message: "Password is incorrect!",
                            });

                        }


                    } else {

                        return res.status(http_status_codes.StatusCodes.UNAUTHORIZED).json({
                            statusCode: http_status_codes.StatusCodes.UNAUTHORIZED,
                            isSuccess: false,
                            message: "Cannot login because Company license has been expired!",
                        });

                    }

                } else {

                    return res.status(http_status_codes.StatusCodes.UNAUTHORIZED).json({
                        statusCode: http_status_codes.StatusCodes.UNAUTHORIZED,
                        isSuccess: false,
                        message: "Cannot login because Company is deleted!",
                    });

                }

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "No Employee found against this email!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in logging in Employee!",
                error: error,
            });

        }
    },


    async emailVerificationCodeEmployee(req, res, next) {
        try {
            const {
                email,
            } = req.body;

            const myEmployee = await Employee.findOne({
                where: {
                    email: email,
                }
            })

            if (myEmployee) {

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
                            employee: myEmployee,
                        });

                    }
                });

            } else {

                return res.status(http_status_codes.StatusCodes.UNAUTHORIZED).json({
                    status_code: http_status_codes.StatusCodes.UNAUTHORIZED,
                    isSuccess: false,
                    message: "No Employee found against this email!",
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

            const myEmployee = await Employee.findOne({
                where: {
                    id: id
                },
                attributes: ['password'],
            })

            if (myEmployee) {

                const verifyPassword = passwordHash.verify(oldPassword, myEmployee.password);

                if (verifyPassword) {

                    if (newPassword.length >= 6) {

                        await Employee.update(
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
                    message: "Employee not found!",
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


            const updatedEmployee = await Employee.update(
                {
                    password: passwordHash.generate(password)
                },
                {
                    where: {
                        id: id
                    }
                }
            )

            if (updatedEmployee[0]) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "Employee Password updated successfully!",
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "Employee data not found!",
                });

            }


        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating Employee Password!",
                error: error,
            });

        }
    },


    async deleteEmployee(req, res, next) {
        try {

            const employeeId = req.params.employeeId;

            const myEmployee = await Employee.findOne({
                where: {
                    id: employeeId
                },
                attributes: ['profilePhoto'],
            })

            const deletedEmployee = await Employee.destroy({
                where: {
                    id: employeeId,
                },
            });

            if (deletedEmployee) {

                if (myEmployee.profilePhoto) {
                    await fileRemover(myEmployee.profilePhoto);
                }

                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    statusCode: http_status_codes.StatusCodes.ACCEPTED,
                    isSuccess: true,
                    message: "Employee deleted successfully!",
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "Employee data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in deleting Employee!",
                error: error,
            });

        }
    },



    async getOneEmployee(req, res, next) {
        try {

            const employeeId = req.params.employeeId;

            const oneEmployee = await Employee.findOne({
                where: {
                    id: employeeId,
                },
            });

            if (oneEmployee) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "One Employee data fetched successfully!",
                    employee: oneEmployee,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "One Employee data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting one Employee!",
                error: error,
            });

        }
    },


    async getAllEmployees(req, res, next) {
        try {

            const allEmployees = await Employee.findAll({
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "All Employees data fetched successfully!",
                employees: allEmployees,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting All Employees!",
                error: error,
            });

        }
    },


    async getEmployeesByCompany(req, res, next) {
        try {

            const companyId = req.params.companyId;

            const allEmployeesByCompany = await Employee.findAll({
                where: {
                    companyId: companyId,
                },
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "Employees by Company data fetched successfully!",
                employees: allEmployeesByCompany,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting Employees by Company!",
                error: error,
            });

        }
    },




    async getEmployeesByFilterWeb(req, res, next) {
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
                    ],
                }
            }

            const myWhere = { ...mySearch, ...myCondition };
            const employeesCount = await Employee.count({ where: myWhere, });
            const pageFilterResult = paginationFiltrationWeb(req.query, employeesCount, myWhere);
            const filteredEmployees = await Employee.findAll(pageFilterResult.filter);

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "Employees by filter for web data fetched successfully!",
                employees: filteredEmployees,
                pagination: pageFilterResult.pagination,
                next: pageFilterResult.next,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting Employees by filter for web!",
                error: error,
            });

        }
    },


}