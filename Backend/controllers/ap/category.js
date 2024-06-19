const http_status_codes = require("http-status-codes");
const { Category, Order, Stock, OrderItem, Company, StorePayment, CustomerDebt, CollectedPayment } = require("../../database");
const passwordHash = require("password-hash");
const { fileRemover, multerFileUploader, sendCodeToEmail, randomNumbersGenerator, nodeGmailAuth, nodemailerTransporter, dateStatementReturn } = require('../../services/utils');
const { tokenCreator } = require("../../services/token");
const moment = require("moment");
const sequelize = require("sequelize");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");

module.exports = {


    async createCategory(req, res, next) {
        try {
            const {
                title,
                companyId,
            } = req.body;

            const categoryCountByTitle = await Category.count({
                where: {
                    title: title,
                    companyId: companyId,
                }
            })

            if (categoryCountByTitle) {

                return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                    statusCode: http_status_codes.StatusCodes.CONFLICT,
                    isSuccess: false,
                    message: "Title already used in another category!",
                });

            } else {

                const createCategory = await Category.create({
                    title: title,
                    companyId: companyId,
                });

                return res.status(http_status_codes.StatusCodes.CREATED).json({
                    statusCode: http_status_codes.StatusCodes.CREATED,
                    isSuccess: true,
                    message: "Category created successfully!",
                    category: createCategory,
                });


            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in creating Category!",
                error: error,
            });

        }
    },



    async updateCategory(req, res, next) {
        try {

            const {
                id,
                title,
                companyId,
            } = req.body;

            const categoryCountByEmail = await Category.count({
                where: {
                    [Op.not]: {
                        id: id,
                    },
                    title: title,
                    companyId: companyId,
                }
            })

            if (categoryCountByEmail) {

                return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                    statusCode: http_status_codes.StatusCodes.CONFLICT,
                    isSuccess: false,
                    message: "Title already used in another category!",
                });

            } else {

                const updatedCategory = await Category.update(
                    {
                        title: title,
                        companyId: companyId,
                    },
                    {
                        where: {
                            id: id,
                        },
                    }
                );

                if (updatedCategory[0]) {

                    const foundCategory = await Category.findOne({
                        where: {
                            id: id,
                        },
                    });

                    return res.status(http_status_codes.StatusCodes.OK).json({
                        statusCode: http_status_codes.StatusCodes.OK,
                        isSuccess: true,
                        message: "Category updated successfully!",
                        category: foundCategory,
                    });

                } else {

                    return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                        statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                        isSuccess: false,
                        message: "Category data not found!",
                    });

                }

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating Category!",
                error: error,
            });

        }
    },


    async deleteCategory(req, res, next) {
        try {

            const categoryId = req.params.categoryId;

            const categorieStocks = await Stock.count({
                where: {
                    categoryId: categoryId,
                }
            });

            if (categorieStocks) {

                return res.status(http_status_codes.StatusCodes.BAD_REQUEST).json({
                    statusCode: http_status_codes.StatusCodes.BAD_REQUEST,
                    isSuccess: false,
                    message: "Category cannot be deleted because it has some stocks!",
                });

            }


            const deletedCategory = await Category.destroy({
                where: {
                    id: categoryId,
                },
            });

            if (deletedCategory) {

                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    statusCode: http_status_codes.StatusCodes.ACCEPTED,
                    isSuccess: true,
                    message: "Category deleted successfully!",
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "Category data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in deleting Category!",
                error: error,
            });

        }
    },



    async getOneCategory(req, res, next) {
        try {

            const categoryId = req.params.categoryId;

            const oneCategory = await Category.findOne({
                where: {
                    id: categoryId,
                },
            });

            if (oneCategory) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "One Category data fetched successfully!",
                    category: oneCategory,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "One Category data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting one Category!",
                error: error,
            });

        }
    },


    async getAllCategories(req, res, next) {
        try {

            const allCategories = await Category.findAll({
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "All Categories data fetched successfully!",
                categories: allCategories,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting All Categories!",
                error: error,
            });

        }
    },

    async getCategoriesByCompany(req, res, next) {
        try {

            const companyId = req.params.companyId;

            const categoriesByCompany = await Category.findAll({
                where: {
                    companyId: companyId,
                },
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "Categories by Company data fetched successfully!",
                categories: categoriesByCompany,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting Categories by Company!",
                error: error,
            });

        }
    },




}