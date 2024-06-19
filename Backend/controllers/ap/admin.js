const http_status_codes = require("http-status-codes");
const { Admin, Order, Stock, OrderItem, Company, StorePayment, CustomerDebt, CollectedPayment } = require("../../database");
const passwordHash = require("password-hash");
const { fileRemover, multerFileUploader, sendCodeToEmail, randomNumbersGenerator, nodeGmailAuth, nodemailerTransporter, dateStatementReturn } = require('../../services/utils');
const { tokenCreator } = require("../../services/token");
const moment = require("moment");
const sequelize = require("sequelize");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");

module.exports = {


    async createAdmin(req, res, next) {
        try {
            const {
                name,
                email,
                password,
            } = req.body;

            const adminCountByEmail = await Admin.count({
                where: {
                    email: email
                }
            })

            if (adminCountByEmail) {

                return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                    statusCode: http_status_codes.StatusCodes.CONFLICT,
                    isSuccess: false,
                    message: "Email already used by another account!",
                });

            } else {

                const mySuperAdmin = await Admin.count({
                    where: { isSuperAdmin: true }
                })

                var varIsSuperAdmin = false;

                if (!mySuperAdmin) {
                    varIsSuperAdmin = true;
                }

                if (password.length >= 6) {

                    const createAdmin = await Admin.create({
                        name: name,
                        email: email,
                        password: passwordHash.generate(password),
                        isSuperAdmin: varIsSuperAdmin,
                    });

                    return res.status(http_status_codes.StatusCodes.CREATED).json({
                        statusCode: http_status_codes.StatusCodes.CREATED,
                        isSuccess: true,
                        message: "Admin created successfully!",
                        admin: createAdmin,
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
                message: "Error occurred in creating Admin!",
                error: error,
            });

        }
    },



    async updateAdmin(req, res, next) {
        try {

            const {
                id,
                name,
                email,
            } = req.body;

            const adminCountByEmail = await Admin.count({
                where: {
                    [Op.not]: {
                        id: id,
                    },
                    email: email
                }
            })

            if (adminCountByEmail) {

                return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                    statusCode: http_status_codes.StatusCodes.CONFLICT,
                    isSuccess: false,
                    message: "Email already used by another account!",
                });

            } else {

                const updatedAdmin = await Admin.update(
                    {
                        name: name,
                        email: email,
                    },
                    {
                        where: {
                            id: id,
                        },
                    }
                );

                if (updatedAdmin[0]) {

                    const foundAdmin = await Admin.findOne({
                        where: {
                            id: id,
                        },
                    });

                    return res.status(http_status_codes.StatusCodes.OK).json({
                        statusCode: http_status_codes.StatusCodes.OK,
                        isSuccess: true,
                        message: "Admin updated successfully!",
                        admin: foundAdmin,
                    });

                } else {

                    return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                        statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                        isSuccess: false,
                        message: "Admin data not found!",
                    });

                }

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating Admin!",
                error: error,
            });

        }
    },



    async updateProfilePhoto(req, res, next) {
        try {

            const adminId = req.params.adminId;

            const myAdmin = await Admin.findOne({
                where: {
                    id: adminId
                },
                attributes: ['profilePhoto']
            })

            if (myAdmin) {

                const fileUploadResult = await multerFileUploader(req.file);

                if (fileUploadResult) {

                    await Admin.update(
                        {
                            profilePhoto: fileUploadResult,
                        },
                        {
                            where: {
                                id: adminId,
                            },
                        }
                    );

                    if (myAdmin.profilePhoto) {
                        fileRemover(myAdmin.profilePhoto)
                    }

                    const foundAdmin = await Admin.findOne({
                        where: {
                            id: adminId,
                        },
                    });

                    return res.status(http_status_codes.StatusCodes.OK).json({
                        statusCode: http_status_codes.StatusCodes.OK,
                        isSuccess: true,
                        message: "Admin ProfilePhoto updated successfully!",
                        admin: foundAdmin,
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
                    message: "Admin data not found!",
                });

            }


        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating Admin ProfilePhoto!",
                error: error,
            });

        }
    },


    async loginAdmin(req, res, next) {
        try {
            const {
                email,
                password,
            } = req.body;

            const myAdmin = await Admin.findOne({
                where: {
                    email: email,
                }
            })

            if (myAdmin) {

                const myCompany = await Company.findOne({
                    where: {
                        adminId: myAdmin.id,
                    },
                    attributes: ['id', 'licenseExpiryDate', 'isDeleted', 'type'],
                })

                var notDeletedCondition = null;

                if (myAdmin.isSuperAdmin) {
                    notDeletedCondition = true;
                } else {
                    if (myCompany.isDeleted) {
                        notDeletedCondition = false;
                    } else {
                        notDeletedCondition = true;
                    }
                }

                if (notDeletedCondition) {

                    var notExpiredLicenseCondition = null;

                    if (myAdmin.isSuperAdmin) {
                        notExpiredLicenseCondition = true;
                    } else {
                        if (myCompany.licenseExpiryDate) {
                            const companyLicenseDate = moment(myCompany.licenseExpiryDate).endOf('day');
                            const todayDate = moment().endOf('day');
                            notExpiredLicenseCondition = todayDate <= companyLicenseDate;
                        } else {
                            notExpiredLicenseCondition = false;
                        }
                    }

                    if (notExpiredLicenseCondition) {

                        const verifyPassword = passwordHash.verify(password, myAdmin.password);

                        if (verifyPassword) {

                            return res.status(http_status_codes.StatusCodes.OK).json({
                                statusCode: http_status_codes.StatusCodes.OK,
                                isSuccess: true,
                                message: "Admin logged in successfully!",
                                admin: myAdmin,
                                company: myCompany,
                                token: tokenCreator(myAdmin.email),
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
                    message: "No Admin found against this email!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in logging in Admin!",
                error: error,
            });

        }
    },


    async emailVerificationCodeAdmin(req, res, next) {
        try {
            const {
                email,
            } = req.body;

            const myAdmin = await Admin.findOne({
                where: {
                    email: email,
                }
            })

            if (myAdmin) {

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
                            admin: myAdmin,
                        });

                    }
                });

            } else {

                return res.status(http_status_codes.StatusCodes.UNAUTHORIZED).json({
                    status_code: http_status_codes.StatusCodes.UNAUTHORIZED,
                    isSuccess: false,
                    message: "No Admin found against this email!",
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

            const myAdmin = await Admin.findOne({
                where: {
                    id: id
                },
                attributes: ['password'],
            })

            if (myAdmin) {

                const verifyPassword = passwordHash.verify(oldPassword, myAdmin.password);

                if (verifyPassword) {

                    if (newPassword.length >= 6) {

                        await Admin.update(
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
                    message: "Admin not found!",
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


            const updatedAdmin = await Admin.update(
                {
                    password: passwordHash.generate(password)
                },
                {
                    where: {
                        id: id
                    }
                }
            )

            if (updatedAdmin[0]) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "Admin Password updated successfully!",
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "Admin data not found!",
                });

            }


        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating Admin Password!",
                error: error,
            });

        }
    },


    async deleteAdmin(req, res, next) {
        try {

            const adminId = req.params.adminId;

            const myAdmin = await Admin.findOne({
                where: {
                    id: adminId
                },
                attributes: ['profilePhoto'],
            })

            const deletedAdmin = await Admin.destroy({
                where: {
                    id: adminId,
                },
            });

            if (deletedAdmin) {

                if (myAdmin.profilePhoto) {
                    await fileRemover(myAdmin.profilePhoto);
                }

                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    statusCode: http_status_codes.StatusCodes.ACCEPTED,
                    isSuccess: true,
                    message: "Admin deleted successfully!",
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "Admin data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in deleting Admin!",
                error: error,
            });

        }
    },



    async getOneAdmin(req, res, next) {
        try {

            const adminId = req.params.adminId;

            const oneAdmin = await Admin.findOne({
                where: {
                    id: adminId,
                },
            });

            if (oneAdmin) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "One Admin data fetched successfully!",
                    admin: oneAdmin,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "One Admin data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting one Admin!",
                error: error,
            });

        }
    },



    async getOneAdminDetail(req, res, next) {
        try {

            const adminId = req.params.adminId;

            const oneAdminDetail = await Admin.findOne({
                where: {
                    id: adminId,
                },
                include: [Company],
            });

            if (oneAdminDetail) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "One Admin detail data fetched successfully!",
                    admin: oneAdminDetail,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "One Admin data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting one Admin detail!",
                error: error,
            });

        }
    },



    async getUnassignAdminsByCompany(req, res, next) {
        try {

            const companyId = req.params.companyId;

            const unassignAdmins = await Admin.findAll({
                where: {
                    '$companies.id$': {
                        [Op.or]: [
                            companyId,
                            null,
                        ]
                    },
                    isSuperAdmin: false,
                },
                include: {
                    model: Company,
                    attributes: ['id'],
                },
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "Unassign Admins data fetched successfully!",
                admins: unassignAdmins,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting Unassign Admins!",
                error: error,
            });

        }
    },


    async getAllAdmins(req, res, next) {
        try {

            const allAdmins = await Admin.findAll({
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "All Admins data fetched successfully!",
                admins: allAdmins,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting All Admins!",
                error: error,
            });

        }
    },


    async getDashboardStatsByCompany(req, res, next) {
        try {

            const companyId = req.params.companyId;

            const topSoldStocksByCompany = await Stock.findAll({
                where: {
                    companyId: companyId,
                },
                attributes: [
                    'id',
                    'title',
                    'fileName',
                    'quantity',
                    'price',
                    [sequelize.fn('SUM', sequelize.col('order_Items.quantity')), 'totalSold']
                ],
                include: [
                    {
                        model: OrderItem,
                        attributes: [],
                        include: [
                            {
                                model: Order,
                                attributes: [],
                                where: {
                                    status: 'completed'
                                }
                            }
                        ]
                    }
                ],
                group: ['stock.id'],
                order: [[sequelize.literal('totalSold'), 'DESC']],
            });

            const leastSoldStocksByCompany = topSoldStocksByCompany.slice().reverse();

            // const completedOrderByCompany = await Order.findAll({
            //     where: {
            //         companyId: companyId,
            //         status: 'completed'
            //     },
            //     include: {
            //         model: OrderItem,
            //         attributes: ['stockId'],
            //         include: {
            //             model: Stock,
            //             attributes: ['id', 'title'],
            //         },
            //     },
            //     attributes: []
            // })

            // const orderItemStocks = completedOrderByCompany.map(element => {
            //     return element.order_Items.map(item => {
            //         return item.stock;
            //     })
            // });

            // var orderItemsList = [];

            // await orderItemStocks.forEach(element => {
            //     myObj = {
            //         data: [],
            //         ids: [],
            //         idString: '',
            //         count: 1,
            //     };
            //     element.forEach(stock => {
            //         if (stock) {
            //             myObj.data.push(stock);
            //             myObj.ids.push(stock.id);
            //         }
            //     });
            //     myObj.ids.sort();
            //     myObj.idString = JSON.stringify(myObj.ids);

            //     function findPreviousObj() {
            //         let result = -1;
            //         orderItemsList.forEach((element, ind) => {
            //             if (element.idString == myObj.idString) {
            //                 result = ind;
            //             }
            //         });
            //         return result;
            //     }

            //     const previousResultInd = findPreviousObj();

            //     if (previousResultInd == -1) {
            //         orderItemsList.push(myObj);
            //     } else {
            //         orderItemsList[previousResultInd].count += 1;
            //     }

            // });

            // const togetherBoughtItemsByCompany = [];

            // await orderItemsList.forEach(orderItem => {
            //     if (orderItem) {
            //         if (orderItem.count > 1) {
            //             const myObj = {
            //                 data: orderItem.data,
            //                 count: orderItem.count,
            //             }
            //             togetherBoughtItemsByCompany.push(myObj);
            //         }
            //     }
            // })

            const stocksByCompany = await Stock.findAll({
                where: {
                    companyId: companyId,
                },
                attributes: [
                    'quantity',
                    'price',
                    'cost',
                    'profit',
                ],
            });

            var stockTotalAmountsData = {
                price: 0,
                cost: 0,
                profit: 0,
            }

            await stocksByCompany.forEach(stock => {
                stockTotalAmountsData.price += stock.price * stock.quantity;
                stockTotalAmountsData.cost += stock.cost * stock.quantity;
                stockTotalAmountsData.profit += stock.profit * stock.quantity;
            });

            // const customerDebtsTotalByCompany = await CustomerDebt.findAll({
            //     where: {
            //         companyId: companyId,
            //     },
            //     attributes: [
            //         [sequelize.fn('sum', sequelize.col('amount')), 'amount'],
            //     ],
            // })

            // const paidStorePaymentsTotalByCompany = await StorePayment.findAll({
            //     where: {
            //         companyId: companyId,
            //         isPaid: true,
            //     },
            //     attributes: [
            //         [sequelize.fn('sum', sequelize.col('amount')), 'amount'],
            //     ],
            // })

            // const unpaidStorePaymentsTotalByCompany = await StorePayment.findAll({
            //     where: {
            //         companyId: companyId,
            //         isPaid: false,
            //     },
            //     attributes: [
            //         [sequelize.fn('sum', sequelize.col('amount')), 'amount'],
            //     ],
            // })

            function itemsReturn(array, size) {
                return array.slice(0, size);
            }

            // function parseDataReturn(data) {
            //     return data[0].amount ? parseInt(data[0].amount) : 0
            // }

            const totalAmountsData = {
                stockPrice: stockTotalAmountsData.price,
                stockCost: stockTotalAmountsData.cost,
                stockProfit: stockTotalAmountsData.profit,
                // customerDebts: parseDataReturn(customerDebtsTotalByCompany),
                // paidStorePayments: parseDataReturn(paidStorePaymentsTotalByCompany),
                // unpaidStorePayments: parseDataReturn(unpaidStorePaymentsTotalByCompany),
            }


            return res.status(http_status_codes.StatusCodes.OK).json({
                status_code: http_status_codes.StatusCodes.OK,
                status: "success",
                message: "Dashboard stats by Company data fetched successfully!",
                totalAmountsList: Object.entries(totalAmountsData).map((e) => ({ name: e[0], value: e[1] })),
                topSoldStocks: itemsReturn(topSoldStocksByCompany, 10),
                leastSoldStocks: itemsReturn(leastSoldStocksByCompany, 10),
                // togetherBoughtItems: itemsReturn(togetherBoughtItemsByCompany, 10),
            });

        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    status_code: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                    status: "error",
                    message: "Error occurred in getting Dashboard stats by Company!",
                    error: error,
                });
        }
    },


    async getSalesAnalyticsByCompany(req, res, next) {
        try {

            const companyId = req.params.companyId;

            const {
                month,
                year,
                type,
            } = req.query;

            var salesDataList = [];

            if (type == 'year-months') {

                const fromDateFormatted = moment(year).startOf('year').toDate();
                const toDateFormatted = moment(year).endOf('year').toDate();


                const salesRecordByCompany = await Order.findAll({
                    attributes: [
                        [sequelize.fn('date_format', sequelize.col('createdAt'), '%Y-%m'), 'month'],
                        [sequelize.fn('sum', sequelize.col('amount')), 'amountTotal'],
                        [sequelize.fn('sum', sequelize.col('cost')), 'costTotal'],
                        [sequelize.fn('sum', sequelize.col('profit')), 'profitTotal'],
                    ],
                    where: {
                        companyId: companyId,
                        status: 'completed',
                        createdAt: {
                            [Op.between]: [fromDateFormatted, toDateFormatted],
                        },
                    },
                    group: [sequelize.literal('month')],
                });


                const monthsDifference = parseInt(moment(toDateFormatted).diff(moment(fromDateFormatted), 'months', true).toFixed());

                for (let i = 0; i < monthsDifference; i++) {
                    const date = moment(fromDateFormatted).add(i, 'months').toDate();
                    const myDate = moment(date).format('YYYY-MM');
                    const formattedDate = moment(date).format('MMM, YYYY');
                    const matchedIndex = salesRecordByCompany.findIndex(x => x.dataValues.month === myDate);
                    var salesObj = {
                        formattedDate: formattedDate,
                        date: myDate,
                        amount: 0,
                        cost: 0,
                        profit: 0,
                    };
                    if (matchedIndex != -1) {
                        const salesData = salesRecordByCompany[matchedIndex].dataValues;
                        salesObj.amount = parseInt(salesData.amountTotal);
                        salesObj.cost = parseInt(salesData.costTotal);
                        salesObj.profit = parseInt(salesData.profitTotal);
                    }
                    salesDataList.push(salesObj);
                }

            } else if (type == 'month-days') {

                const monthYear = `${year}-${month}-01`
                const fromDateFormatted = moment(monthYear).startOf('month').toDate();
                const toDateFormatted = moment(monthYear).endOf('month').toDate();

                const salesRecordByCompany = await Order.findAll({
                    attributes: [
                        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                        [sequelize.fn('sum', sequelize.col('amount')), 'amountTotal'],
                        [sequelize.fn('sum', sequelize.col('cost')), 'costTotal'],
                        [sequelize.fn('sum', sequelize.col('profit')), 'profitTotal'],

                    ],
                    where: {
                        companyId: companyId,
                        status: 'completed',
                        createdAt: {
                            [Op.between]: [fromDateFormatted, toDateFormatted]
                        }
                    },
                    group: ['date']
                });

                const daysQty = moment(monthYear).daysInMonth();

                for (let i = 0; i < daysQty; i++) {
                    const date = `${year}-${month}-${i + 1}`;
                    const myDate = moment(new Date(date)).format('YYYY-MM-DD');
                    const formattedDate = moment(new Date(date)).format('MMM DD, YYYY');
                    const matchedIndex = salesRecordByCompany.findIndex(x => x.dataValues.date === myDate);
                    var salesObj = {
                        formattedDate: formattedDate,
                        date: myDate,
                        amount: 0,
                        cost: 0,
                        profit: 0,
                    };
                    if (matchedIndex != -1) {
                        const salesData = salesRecordByCompany[matchedIndex].dataValues;
                        salesObj.amount = parseInt(salesData.amountTotal);
                        salesObj.cost = parseInt(salesData.costTotal);
                        salesObj.profit = parseInt(salesData.profitTotal);
                    }
                    salesDataList.push(salesObj);
                }

            }


            return res.status(http_status_codes.StatusCodes.OK).json({
                status_code: http_status_codes.StatusCodes.OK,
                status: "success",
                message: "Sales Analytics by Company data fetched successfully!",
                salesList: salesDataList,
            });

        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    status_code: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                    status: "error",
                    message: "Error occurred in getting Sales Analytics by Company!",
                    error: error,
                });
        }
    },


    async getStorePaymentAnalyticsByCompany(req, res, next) {
        try {

            const companyId = req.params.companyId;

            const {
                month,
                year,
                type,
            } = req.query;

            var storePaymentDataList = [];

            if (type == 'year-months') {

                const fromDateFormatted = moment(year).startOf('year').toDate();
                const toDateFormatted = moment(year).endOf('year').toDate();

                const storePaymentRecordByCompany = await StorePayment.findAll({
                    attributes: [
                        [sequelize.fn('date_format', sequelize.col('createdAt'), '%Y-%m'), 'month'],
                        [sequelize.fn('sum', sequelize.col('amount')), 'amountTotal'],
                    ],
                    where: {
                        companyId: companyId,
                        isPaid: true,
                        createdAt: {
                            [Op.between]: [fromDateFormatted, toDateFormatted],
                        },
                    },
                    group: [sequelize.literal('month')],
                });


                const monthsDifference = parseInt(moment(toDateFormatted).diff(moment(fromDateFormatted), 'months', true).toFixed());

                for (let i = 0; i < monthsDifference; i++) {
                    const date = moment(fromDateFormatted).add(i, 'months').toDate();
                    const myDate = moment(date).format('YYYY-MM');
                    const formattedDate = moment(date).format('MMM, YYYY');
                    const matchedIndex = storePaymentRecordByCompany.findIndex(x => x.dataValues.month === myDate);
                    var storePaymentObj = {
                        formattedDate: formattedDate,
                        date: myDate,
                        amount: 0,
                    };
                    if (matchedIndex != -1) {
                        const storePaymentData = storePaymentRecordByCompany[matchedIndex].dataValues;
                        storePaymentObj.amount = parseInt(storePaymentData.amountTotal);
                    }
                    storePaymentDataList.push(storePaymentObj);
                }

            } else if (type == 'month-days') {

                const monthYear = `${year}-${month}-01`
                const fromDateFormatted = moment(monthYear).startOf('month').toDate();
                const toDateFormatted = moment(monthYear).endOf('month').toDate();

                const storePaymentRecordByCompany = await StorePayment.findAll({
                    attributes: [
                        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                        [sequelize.fn('sum', sequelize.col('amount')), 'amountTotal'], // sum the amount values
                    ],
                    where: {
                        companyId: companyId,
                        isPaid: true,
                        createdAt: {
                            [Op.between]: [fromDateFormatted, toDateFormatted]
                        }
                    },
                    group: ['date']
                });

                const daysQty = moment(monthYear).daysInMonth();

                for (let i = 0; i < daysQty; i++) {
                    const date = `${year}-${month}-${i + 1}`;
                    const myDate = moment(new Date(date)).format('YYYY-MM-DD');
                    const formattedDate = moment(new Date(date)).format('MMM DD, YYYY');
                    const matchedIndex = storePaymentRecordByCompany.findIndex(x => x.dataValues.date === myDate);
                    var storePaymentObj = {
                        formattedDate: formattedDate,
                        date: myDate,
                        amount: 0,
                    };
                    if (matchedIndex != -1) {
                        const storePaymentData = storePaymentRecordByCompany[matchedIndex].dataValues;
                        storePaymentObj.amount = parseInt(storePaymentData.amountTotal);
                    }
                    storePaymentDataList.push(storePaymentObj);
                }

            }

            return res.status(http_status_codes.StatusCodes.OK).json({
                status_code: http_status_codes.StatusCodes.OK,
                status: "success",
                message: "StorePayment Analytics by Company data fetched successfully!",
                storePaymentList: storePaymentDataList,
            });

        } catch (error) {

            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    status_code: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                    status: "error",
                    message: "Error occurred in getting StorePayment Analytics by Company!",
                    error: error,
                });

        }
    },



    async getOrderAmountsByCompanyAndDate(req, res, next) {
        try {

            const {
                date,
                fromDate,
                toDate,
                type,
                companyId,
                categoryId,
            } = req.query;

            const dateWhereStatement = dateStatementReturn(req.query);

            var orderStatement = {
                where: {
                    companyId: companyId,
                    status: 'completed',
                    ...dateWhereStatement,
                },
                attributes: ['amount', 'cost', 'profit']
                // attributes: [
                //     [sequelize.fn('SUM', sequelize.col('amount')), 'amount'],
                //     [sequelize.fn('SUM', sequelize.col('cost')), 'cost'],
                //     [sequelize.fn('SUM', sequelize.col('profit')), 'profit'],
                // ]
            }

            if (categoryId && categoryId != '0') {
                var myCategoryId = null;
                if (categoryId != 'null') {
                    myCategoryId = categoryId;
                }
                const categoryStatement = {
                    include: {
                        model: OrderItem,
                        attributes: [],
                        required: true,
                        include: {
                            model: Stock,
                            where: {
                                categoryId: myCategoryId,
                            },
                            required: true,
                            attributes: [],
                        }
                    }
                };
                orderStatement = { ...orderStatement, ...categoryStatement };
            };

            const completedOrdersData = await Order.findAll(orderStatement);

            let totalAmount = 0;
            let totalCost = 0;
            let totalProfit = 0;

            for (let i = 0; i < completedOrdersData.length; i++) {
                totalAmount += completedOrdersData[i].amount;
                totalCost += completedOrdersData[i].cost;
                totalProfit += completedOrdersData[i].profit;
            }

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "Order Amounts by Company and Date data fetched successfully!",
                orderAmounts: {
                    amount: totalAmount,
                    cost: totalCost,
                    profit: totalProfit,
                },
                // orderAmounts: {
                //     amount: completedOrdersData[0].amount ?? "0",
                //     cost: completedOrdersData[0].cost ?? "0",
                //     profit: completedOrdersData[0].profit ?? "0",
                // },
            });


        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting Order Amounts by Company and Date!",
                error: error,
            });

        }
    },


    async getStorePaymentAmountsByCompanyAndDate(req, res, next) {
        try {

            const {
                date,
                fromDate,
                toDate,
                type,
                companyId,
            } = req.query;

            var whereStatement = {};

            whereStatement = dateStatementReturn(req.query);

            const paidStorePaymentData = await StorePayment.findAll({
                where: {
                    companyId: companyId,
                    isPaid: true,
                    ...whereStatement,
                },
                attributes: [
                    [sequelize.fn('SUM', sequelize.col('amount')), 'amount'],
                ]
            });

            const unPaidStorePaymentData = await StorePayment.findAll({
                where: {
                    companyId: companyId,
                    isPaid: false,
                    ...whereStatement,
                },
                attributes: [
                    [sequelize.fn('SUM', sequelize.col('amount')), 'amount'],
                ]
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "Store Payment Amounts by Company and Date data fetched successfully!",
                storePaymentAmounts: {
                    paid: paidStorePaymentData.length ? parseInt(paidStorePaymentData[0].amount ?? 0) : 0,
                    unPaid: unPaidStorePaymentData.length ? parseInt(unPaidStorePaymentData[0].amount ?? 0) : 0,
                },
            });


        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting Store Payment Amounts by Company and Date!",
                error: error,
            });

        }
    },


    async getCollectedPaymentAmountsByCompanyAndDate(req, res, next) {
        try {

            const {
                date,
                fromDate,
                toDate,
                type,
                companyId,
            } = req.query;

            var whereStatement = {};

            whereStatement = dateStatementReturn(req.query);

            const dollarCollectedPaymentData = await CollectedPayment.findAll({
                where: {
                    companyId: companyId,
                    amountType: 'dollar',
                    ...whereStatement,
                },
                attributes: [
                    [sequelize.fn('SUM', sequelize.col('amount')), 'amount'],
                ]
            });

            const lebaneseCollectedPaymentData = await CollectedPayment.findAll({
                where: {
                    companyId: companyId,
                    amountType: 'lebanese',
                    ...whereStatement,
                },
                attributes: [
                    [sequelize.fn('SUM', sequelize.col('amount')), 'amount'],
                ]
            });

            const euroCollectedPaymentData = await CollectedPayment.findAll({
                where: {
                    companyId: companyId,
                    amountType: 'euro',
                    ...whereStatement,
                },
                attributes: [
                    [sequelize.fn('SUM', sequelize.col('amount')), 'amount'],
                ]
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "Collected Payment Amounts by Company and Date data fetched successfully!",
                collectedPaymentAmounts: {
                    dollar: dollarCollectedPaymentData.length ? parseInt(dollarCollectedPaymentData[0].amount ?? 0) : 0,
                    lebanese: lebaneseCollectedPaymentData.length ? parseInt(lebaneseCollectedPaymentData[0].amount ?? 0) : 0,
                    euro: euroCollectedPaymentData.length ? parseInt(euroCollectedPaymentData[0].amount ?? 0) : 0,
                },
            });


        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting Collected Payment Amounts by Company and Date!",
                error: error,
            });

        }
    },


    async getCustomerDebtAmountsByCompanyAndDate(req, res, next) {
        try {

            const {
                date,
                fromDate,
                toDate,
                type,
                companyId,
            } = req.query;

            var whereStatement = {};

            whereStatement = dateStatementReturn(req.query);

            const customerDebtData = await CustomerDebt.findAll({
                where: {
                    companyId: companyId,
                    ...whereStatement,
                },
                attributes: [
                    [sequelize.fn('SUM', sequelize.col('amount')), 'amount'],
                ]
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "Customer Debt Amounts by Company and Date data fetched successfully!",
                customerDebtAmounts: customerDebtData.length ? parseInt(customerDebtData[0].amount ?? 0) : 0,
            });


        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting Customer Debt Amounts by Company and Date!",
                error: error,
            });

        }
    },





}