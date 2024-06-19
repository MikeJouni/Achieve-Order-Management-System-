const http_status_codes = require("http-status-codes");
const { Stock, Order, OrderItem, Category } = require("../../database.js");
const { createActivity } = require("../../services/activity.js");
const { multerFileUploader, fileRemover, gamingLabCompanyId, isValueNotNull, paginationFiltrationWeb } = require("../../services/utils.js");
const { Op } = require("sequelize");

module.exports = {


    async createStock(req, res, next) {
        try {
            const {
                title,
                fileName,
                price,
                cost,
                profit,
                quantity,
                source,
                note,
                barcode,
                isVisible,
                isUnlimitedQty,
                isVisibleToWebsite,
                employeeId,
                companyId,
                categoryId,
            } = req.body;

            if (barcode) {

                const stockCountByBarCode = await Stock.count({
                    where: {
                        barcode: barcode,
                    },
                })

                if (barcode.length && stockCountByBarCode) {

                    return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                        statusCode: http_status_codes.StatusCodes.CONFLICT,
                        isSuccess: false,
                        message: "Barcode already used in another stock!",
                    });

                }
            }

            const createStock = await Stock.create({
                title: title,
                fileName: fileName,
                price: price,
                cost: cost,
                profit: profit,
                quantity: quantity,
                source: source,
                note: note,
                barcode: barcode,
                isVisible: isVisible,
                isUnlimitedQty: isUnlimitedQty,
                isVisibleToWebsite: isVisibleToWebsite,
                companyId: companyId,
                categoryId: categoryId,
            });

            await createActivity({
                collectedPaymentId: null,
                companyId: companyId,
                customerId: null,
                driverId: null,
                employeeId: employeeId,
                orderId: null,
                stockId: createStock.id,
                storePaymentId: null,
                type: employeeId ? 'employee-created-stock' : 'admin-created-stock',
            });

            const createdStockWithCategory = await Stock.findOne({
                where: {
                    id: createStock.id,
                },
                include: {
                    model: Category,
                },
            });

            return res.status(http_status_codes.StatusCodes.CREATED).json({
                statusCode: http_status_codes.StatusCodes.CREATED,
                isSuccess: true,
                message: "Stock created successfully!",
                stock: createdStockWithCategory,
            });


        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in creating Stock!",
                error: error,
            });

        }
    },


    async updateStock(req, res, next) {
        try {

            const {
                id,
                title,
                // fileName,
                price,
                cost,
                profit,
                quantity,
                source,
                note,
                barcode,
                isVisible,
                isUnlimitedQty,
                isVisibleToWebsite,
                employeeId,
                companyId,
                categoryId,
            } = req.body;

            if (barcode) {

                const stockCountByBarCode = await Stock.count({
                    where: {
                        [Op.not]: {
                            id: id,
                        },
                        barcode: barcode,
                    },
                })

                if (barcode.length && stockCountByBarCode) {

                    return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                        statusCode: http_status_codes.StatusCodes.CONFLICT,
                        isSuccess: false,
                        message: "Barcode already used in another stock!",
                    });

                }
            }

            const updatedStock = await Stock.update(
                {
                    title: title,
                    // fileName: fileName,
                    price: price,
                    cost: cost,
                    profit: profit,
                    quantity: quantity,
                    source: source,
                    note: note,
                    barcode: barcode,
                    isVisible: isVisible,
                    isUnlimitedQty: isUnlimitedQty,
                    isVisibleToWebsite: isVisibleToWebsite,
                    companyId: companyId,
                    categoryId: categoryId,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );

            if (updatedStock[0]) {

                await createActivity({
                    collectedPaymentId: null,
                    companyId: companyId,
                    customerId: null,
                    driverId: null,
                    employeeId: employeeId,
                    orderId: null,
                    stockId: id,
                    storePaymentId: null,
                    type: employeeId ? 'employee-updated-stock' : 'admin-updated-stock',
                });

                const foundStock = await Stock.findOne({
                    where: {
                        id: id,
                    },
                    include: {
                        model: Category,
                    },
                });

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "Stock updated successfully!",
                    stock: foundStock,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "Stock data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating Stock!",
                error: error,
            });

        }
    },



    async updateStockVisible(req, res, next) {
        try {

            const {
                id,
                isVisible,
            } = req.body;

            const updatedStock = await Stock.update(
                {
                    isVisible: isVisible,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );

            if (updatedStock[0]) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: `Stock successfully made ${isVisible ? 'Visible' : 'Invisible'}!`,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "Stock data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating Stock Visible!",
                error: error,
            });

        }
    },



    async updateStockVisibleToWebsite(req, res, next) {
        try {

            const {
                id,
                isVisibleToWebsite,
            } = req.body;

            const updatedStock = await Stock.update(
                {
                    isVisibleToWebsite: isVisibleToWebsite,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );

            if (updatedStock[0]) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: `Stock successfully made ${isVisibleToWebsite ? 'Visible' : 'Invisible'} to Website!`,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "Stock data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating Stock Visible to Website!",
                error: error,
            });

        }
    },


    async updateStockImage(req, res, next) {
        try {

            const stockId = req.params.stockId;

            const myStock = await Stock.findOne({
                where: {
                    id: stockId
                },
                attributes: ['fileName']
            })

            if (myStock) {

                const fileUploadResult = await multerFileUploader(req.file);

                if (fileUploadResult) {

                    await Stock.update(
                        {
                            fileName: fileUploadResult,
                        },
                        {
                            where: {
                                id: stockId,
                            },
                        }
                    );

                    if (myStock.fileName) {
                        fileRemover(myStock.fileName)
                    }

                    const foundStock = await Stock.findOne({
                        where: {
                            id: stockId,
                        },
                    });

                    return res.status(http_status_codes.StatusCodes.OK).json({
                        statusCode: http_status_codes.StatusCodes.OK,
                        isSuccess: true,
                        message: "Stock FileName updated successfully!",
                        stock: foundStock,
                    });

                } else {

                    return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                        statusCode: http_status_codes.StatusCodes.CONFLICT,
                        isSuccess: false,
                        message: "Error occurred in uploading FileName!",
                    });

                }


            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "Stock data not found!",
                });

            }


        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating Stock FileName!",
                error: error,
            });

        }
    },


    async deleteStock(req, res, next) {
        try {

            const stockId = req.params.stockId;

            const myStock = await Stock.findOne({
                where: {
                    id: stockId
                },
                attributes: ['fileName'],
            })

            const deletedStock = await Stock.destroy({
                where: {
                    id: stockId,
                },
            });

            if (deletedStock) {

                if (myStock.fileName) {
                    await fileRemover(myStock.fileName);
                }

                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    statusCode: http_status_codes.StatusCodes.ACCEPTED,
                    isSuccess: true,
                    message: "Stock deleted successfully!",
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "Stock data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in deleting Stock!",
                error: error,
            });

        }
    },


    async getStockDetail(req, res, next) {
        try {

            const stockId = req.params.stockId;

            const oneStock = await Stock.findOne({
                where: {
                    id: stockId,
                },
                include: {
                    model: Category,
                }
            });

            const inProgressItemsCount = await OrderItem.count({
                where: {
                    stockId: stockId,
                },
                include: {
                    model: Order,
                    required: true,
                    where: {
                        status: 'in-progress',
                    }
                }
            })

            const completedItemsCount = await OrderItem.count({
                where: {
                    stockId: stockId,
                },
                include: {
                    model: Order,
                    required: true,
                    where: {
                        status: 'completed',
                    }
                }
            })

            const cancelledItemsCount = await OrderItem.count({
                where: {
                    stockId: stockId,
                },
                include: {
                    model: Order,
                    required: true,
                    where: {
                        status: 'cancelled',
                    }
                }
            })

            if (oneStock) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "One Stock data fetched successfully!",
                    stock: oneStock,
                    orderItems: {
                        inProgress: inProgressItemsCount,
                        completed: completedItemsCount,
                        cancelled: cancelledItemsCount,
                    }
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "One Stock data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting one Stock!",
                error: error,
            });

        }
    },


    async getAllStocks(req, res, next) {
        try {

            const allStocks = await Stock.findAll({
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "All Stocks data fetched successfully!",
                stocks: allStocks,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting All Stocks!",
                error: error,
            });

        }
    },


    async getStocksByCompany(req, res, next) {
        try {

            const companyId = req.params.companyId;

            const allStocksByCompany = await Stock.findAll({
                where: {
                    companyId: companyId,
                },
                include: {
                    model: Category,
                },
                order: [["createdAt", "DESC"]],
            });


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

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "All Stocks by Company data fetched successfully!",
                stocks: allStocksByCompany,
                stockAmount: {
                    stockPrice: stockTotalAmountsData.price,
                    stockCost: stockTotalAmountsData.cost,
                    stockProfit: stockTotalAmountsData.profit,
                }
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting All Stocks by Company!",
                error: error,
            });

        }
    },


    async getStocksByCompanyAndCategory(req, res, next) {
        try {

            const {
                companyId,
                categoryId,
            } = req.query;

            var whereStatement = {};

            if (companyId && companyId != 'null') {
                whereStatement['companyId'] = companyId;
            }
            if (categoryId && categoryId != '0') {
                if (categoryId != 'null') {
                    whereStatement['categoryId'] = categoryId;
                } else {
                    whereStatement['categoryId'] = null;
                }
            };

            const allStocksByCompany = await Stock.findAll({
                where: whereStatement,
                include: {
                    model: Category,
                },
                order: [["createdAt", "DESC"]],
            });


            const stocksByCompany = await Stock.findAll({
                where: whereStatement,
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

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "All Stocks by Company data fetched successfully!",
                stocks: allStocksByCompany,
                stockAmount: {
                    stockPrice: stockTotalAmountsData.price,
                    stockCost: stockTotalAmountsData.cost,
                    stockProfit: stockTotalAmountsData.profit,
                }
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting All Stocks by Company!",
                error: error,
            });

        }
    },


    async getListStocksByCompany(req, res, next) {
        try {

            const companyId = req.params.companyId;

            const stocksByCompany = await Stock.findAll({
                where: {
                    companyId: companyId,
                },
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "Stocks list by Company data fetched successfully!",
                stocks: stocksByCompany,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting Stocks list by Company!",
                error: error,
            });

        }
    },


    async getVisibleListStocksByCompany(req, res, next) {
        try {

            const companyId = req.params.companyId;

            const visibleStocksByCompany = await Stock.findAll({
                where: {
                    isVisible: true,
                    companyId: companyId,
                },
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "Visible Stocks list by Company data fetched successfully!",
                stocks: visibleStocksByCompany,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting Visible Stocks list by Company!",
                error: error,
            });

        }
    },




    async getStocksByFilterWeb(req, res, next) {
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
                            title: {
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            fileName: {
                                [Op.like]: `%${search}`
                            }
                        },
                        {
                            price: {
                                [Op.like]: `%${search}`
                            }
                        },
                        {
                            quantity: {
                                [Op.like]: `%${search}`
                            }
                        },
                        {
                            cost: {
                                [Op.like]: `%${search}`
                            }
                        },
                        {
                            profit: {
                                [Op.like]: `%${search}`
                            }
                        },
                        {
                            source: {
                                [Op.like]: `%${search}`
                            }
                        },
                        {
                            note: {
                                [Op.like]: `%${search}`
                            }
                        },
                        {
                            barcode: {
                                [Op.like]: `%${search}`
                            }
                        },
                    ],
                }
            }

            const myWhere = { ...mySearch, ...myCondition };
            const stocksCount = await Stock.count({ where: myWhere, });
            const pageFilterResult = paginationFiltrationWeb(req.query, stocksCount, myWhere);
            const filteredStocks = await Stock.findAll(pageFilterResult.filter);

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "Stocks by filter for web data fetched successfully!",
                stocks: filteredStocks,
                pagination: pageFilterResult.pagination,
                next: pageFilterResult.next,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting Stocks by filter for web!",
                error: error,
            });

        }
    },



    async getStocksByCategoryOfGL(req, res, next) {
        try {

            const companyId = await gamingLabCompanyId();

            if (!companyId) {
                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: true,
                    message: "Gaming LB company not found!",
                });
            }

            const {
                categoryId
            } = req.query;

            var categoryStatement = {};

            if (categoryId) {
                categoryStatement['categoryId'] = categoryId;
            }

            const visibleStocksByCompany = await Stock.findAll({
                where: {
                    isVisible: true,
                    companyId: companyId,
                    ...categoryStatement,
                },
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "Gaming LB Stocks data fetched successfully!",
                stocks: visibleStocksByCompany,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting Gaming LB Stocks!",
                error: error,
            });

        }
    },

}