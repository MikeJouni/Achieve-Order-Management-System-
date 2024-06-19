const http_status_codes = require("http-status-codes");
const { FavoriteStock, Stock } = require("../../database.js");
const { createActivity } = require("../../services/activity.js");
const { isValueNotNull, paginationFiltrationWeb } = require("../../services/utils.js");
const { Op } = require("sequelize");


module.exports = {


    async createFavoriteStock(req, res, next) {
        try {
            const {
                customerId,
                stockId,
            } = req.body;

            const createFavoriteStock = await FavoriteStock.create({
                customerId: customerId,
                stockId: stockId,
            });

            return res.status(http_status_codes.StatusCodes.CREATED).json({
                statusCode: http_status_codes.StatusCodes.CREATED,
                isSuccess: true,
                message: "FavoriteStock created successfully!",
                favoriteStock: createFavoriteStock,
            });


        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in creating FavoriteStock!",
                error: error,
            });

        }
    },


    async updateFavoriteStock(req, res, next) {
        try {

            const {
                id,
                customerId,
                stockId,
            } = req.body;

            const updatedFavoriteStock = await FavoriteStock.update(
                {
                    customerId: customerId,
                    stockId: stockId,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );

            if (updatedFavoriteStock[0]) {

                const foundFavoriteStock = await FavoriteStock.findOne({
                    where: {
                        id: id,
                    },
                });

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "FavoriteStock updated successfully!",
                    favoriteStock: foundFavoriteStock,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "FavoriteStock data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating FavoriteStock!",
                error: error,
            });

        }
    },


    async deleteFavoriteStock(req, res, next) {
        try {

            const favoriteStockId = req.params.favoriteStockId;

            const deletedFavoriteStock = await FavoriteStock.destroy({
                where: {
                    id: favoriteStockId,
                },
            });

            if (deletedFavoriteStock) {

                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    statusCode: http_status_codes.StatusCodes.ACCEPTED,
                    isSuccess: true,
                    message: "FavoriteStock deleted successfully!",
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "FavoriteStock data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in deleting FavoriteStock!",
                error: error,
            });

        }
    },


    async getOneFavoriteStock(req, res, next) {
        try {

            const favoriteStockId = req.params.favoriteStockId;

            const oneFavoriteStock = await FavoriteStock.findOne({
                where: {
                    id: favoriteStockId,
                },
            });

            if (oneFavoriteStock) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "One FavoriteStock data fetched successfully!",
                    favoriteStock: oneFavoriteStock,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "One FavoriteStock data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting one FavoriteStock!",
                error: error,
            });

        }
    },


    async getAllFavoriteStocks(req, res, next) {
        try {

            const allFavoriteStocks = await FavoriteStock.findAll({
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "All FavoriteStocks data fetched successfully!",
                favoriteStocks: allFavoriteStocks,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting All FavoriteStocks!",
                error: error,
            });

        }
    },


    async getFavoriteStocksByCompany(req, res, next) {
        try {

            const companyId = req.params.companyId;

            const favoriteStocksByCompany = await FavoriteStock.findAll({
                include: {
                    model: Stock,
                    attributes: [],
                    required: true,
                    where: {
                        companyId: companyId,
                    },
                },
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "FavoriteStocks by Company data fetched successfully!",
                favoriteStocks: favoriteStocksByCompany,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting FavoriteStocks by Company!",
                error: error,
            });

        }
    },


    async getFavoriteStocksByFilterWeb(req, res, next) {
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
            var myInclude = [];

            if (isValueNotNull(companyId)) {
                myInclude = [
                    {
                        model: Stock,
                        attributes: [],
                        required: true,
                        where: {
                            companyId: companyId,
                        },
                    }
                ]
            }

            // if (isValueNotNull(search)) {
            //     mySearch = {
            //         [Op.or]: [
            //         ],
            //     }
            // }

            const myWhere = { ...mySearch, ...myCondition };
            const favoriteStocksCount = await FavoriteStock.count({ where: myWhere, });
            const pageFilterResult = paginationFiltrationWeb(req.query, favoriteStocksCount, myWhere, myInclude);
            const filteredFavoriteStocks = await FavoriteStock.findAll(pageFilterResult.filter);

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "FavoriteStocks by filter for web data fetched successfully!",
                favoriteStocks: filteredFavoriteStocks,
                pagination: pageFilterResult.pagination,
                next: pageFilterResult.next,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting FavoriteStocks by filter for web!",
                error: error,
            });

        }
    },


    // =====================================================
    // Website APIs


    async setFavoriteStockOfGL(req, res, next) {
        try {

            const {
                customerId,
                stockId,
            } = req.body;

            const myFavoriteStockCount = await FavoriteStock.count({
                where: {
                    customerId: customerId,
                    stockId: stockId,
                }
            })

            if (myFavoriteStockCount) {

                await FavoriteStock.destroy(
                    {
                        where: {
                            customerId: customerId,
                            stockId: stockId,
                        },
                    }
                );

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "FavoriteStock set successfully!",
                    action: 'delete',
                });

            } else {

                await FavoriteStock.create(
                    {
                        customerId: customerId,
                        stockId: stockId,
                    },
                );

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "FavoriteStock set successfully!",
                    action: 'create',
                });

            }


        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in setting FavoriteStock!",
                error: error,
            });

        }
    },

}