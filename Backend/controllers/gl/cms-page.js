const http_status_codes = require("http-status-codes");
const { CmsPage } = require("../../database");
const { isValueNotNull, paginationFiltrationWeb, gamingLabCompanyId } = require('../../services/utils');
const { Op } = require("sequelize");

module.exports = {


    async createCmsPage(req, res, next) {
        try {
            const {
                type,
                text,
                companyId,
            } = req.body;

            const createCmsPage = await CmsPage.create({
                type: type,
                text: text,
                companyId: companyId,
            });

            return res.status(http_status_codes.StatusCodes.CREATED).json({
                statusCode: http_status_codes.StatusCodes.CREATED,
                isSuccess: true,
                message: "CmsPage created successfully!",
                cmsPage: createCmsPage,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in creating CmsPage!",
                error: error,
            });

        }
    },



    async updateCmsPage(req, res, next) {
        try {

            const {
                id,
                type,
                text,
                companyId,
            } = req.body;

            const updatedCmsPage = await CmsPage.update(
                {
                    type: type,
                    text: text,
                    companyId: companyId,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );

            if (updatedCmsPage[0]) {

                const foundCmsPage = await CmsPage.findOne({
                    where: {
                        id: id,
                    },
                });

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "CmsPage updated successfully!",
                    cmsPage: foundCmsPage,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "CmsPage data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating CmsPage!",
                error: error,
            });

        }
    },


    async deleteCmsPage(req, res, next) {
        try {

            const cmsPageId = req.params.cmsPageId;

            const deletedCmsPage = await CmsPage.destroy({
                where: {
                    id: cmsPageId,
                },
            });

            if (deletedCmsPage) {

                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    statusCode: http_status_codes.StatusCodes.ACCEPTED,
                    isSuccess: true,
                    message: "CmsPage deleted successfully!",
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "CmsPage data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in deleting CmsPage!",
                error: error,
            });

        }
    },



    async getOneCmsPage(req, res, next) {
        try {

            const cmsPageId = req.params.cmsPageId;

            const oneCmsPage = await CmsPage.findOne({
                where: {
                    id: cmsPageId,
                },
            });

            if (oneCmsPage) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "One CmsPage data fetched successfully!",
                    cmsPage: oneCmsPage,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "One CmsPage data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting one CmsPage!",
                error: error,
            });

        }
    },


    async getAllCmsPages(req, res, next) {
        try {

            const allCmsPages = await CmsPage.findAll({
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "All CmsPages data fetched successfully!",
                cmsPages: allCmsPages,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting All CmsPages!",
                error: error,
            });

        }
    },

    async getCmsPagesByCompany(req, res, next) {
        try {

            const companyId = req.params.companyId;

            const cmsPagesByCompany = await CmsPage.findAll({
                where: {
                    companyId: companyId,
                },
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "CmsPages by Company data fetched successfully!",
                cmsPages: cmsPagesByCompany,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting CmsPages by Company!",
                error: error,
            });

        }
    },


    async getCmsPagesByFilterWeb(req, res, next) {
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
                            type: {
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            text: {
                                [Op.like]: `%${search}%`
                            }
                        },
                    ],
                }
            }


            const myWhere = { ...mySearch, ...myCondition };
            const cmsPagesCount = await CmsPage.count({ where: myWhere, });
            const pageFilterResult = paginationFiltrationWeb(req.query, cmsPagesCount, myWhere);
            const filteredCmsPages = await CmsPage.findAll(pageFilterResult.filter);

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "CmsPages by filter for web data fetched successfully!",
                cmsPages: filteredCmsPages,
                pagination: pageFilterResult.pagination,
                next: pageFilterResult.next,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting CmsPages by filter for web!",
                error: error,
            });

        }
    },




    async getCmsPageByType(req, res, next) {

        try {

            const {
                type,
                companyId,
            } = req.query;

            const oneCmsPage = await CmsPage.findOne({
                where: {
                    type: type,
                    companyId: companyId,
                },
            });

            if (oneCmsPage) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "CMS Page by type data fetched successfully!",
                    cmsPage: oneCmsPage,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: false,
                    message: "CMS Page data not found!",
                    cmsPage: {
                        text: null,
                        type: type,
                        companyId: companyId,
                    },
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting CMS Page by type!",
                error: error,
            });

        }

    },



    async setCmsPageByType(req, res, next) {

        try {

            const {
                text,
                type,
                companyId,
            } = req.body;

            const myCmsPage = await CmsPage.count({
                where: {
                    type: type,
                    companyId: companyId,
                }
            });

            if (myCmsPage) {

                await CmsPage.update(
                    {
                        text: text,
                    },
                    {
                        where: {
                            type: type,
                            companyId: companyId,
                        },
                    }
                );

            } else {

                await CmsPage.create(
                    {
                        text: text,
                        type: type,
                        companyId: companyId,
                    },
                );

            }

            const myUpdatedCmsPage = await CmsPage.findOne({
                where: {
                    type: type,
                    companyId: companyId,
                },
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "CMS Page set by type successfully!",
                cmsPage: myUpdatedCmsPage,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in setting CMS Page by type!",
                error: error,
            });

        }

    },





    async getCmsPageByTypeOfGL(req, res, next) {

        try {

            const cmsPageType = req.params.cmsPageType;

            const companyId = await gamingLabCompanyId();

            const oneCmsPage = await CmsPage.findOne({
                where: {
                    type: cmsPageType,
                    companyId: companyId,
                },
            });

            if (oneCmsPage) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "CMS Page by type data fetched successfully!",
                    cmsPage: oneCmsPage,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: false,
                    message: "CMS Page data not found!",
                    cmsPage: {
                        text: null,
                        type: cmsPageType,
                        companyId: companyId,
                    },
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting CMS Page by type!",
                error: error,
            });

        }

    },



}