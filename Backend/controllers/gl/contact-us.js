const http_status_codes = require("http-status-codes");
const { ContactUs } = require("../../database");
const { isValueNotNull, paginationFiltrationWeb, gamingLabCompanyId } = require('../../services/utils');
const { Op } = require("sequelize");

module.exports = {


    async createContactUs(req, res, next) {
        try {
            const {
                name,
                email,
                subject,
                message,
                isRead,
                companyId,
            } = req.body;

            const createContactUs = await ContactUs.create({
                name: name,
                email: email,
                subject: subject,
                message: message,
                isRead: isRead,
                companyId: companyId,
            });

            return res.status(http_status_codes.StatusCodes.CREATED).json({
                statusCode: http_status_codes.StatusCodes.CREATED,
                isSuccess: true,
                message: "ContactUs created successfully!",
                contactUs: createContactUs,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in creating ContactUs!",
                error: error,
            });

        }
    },



    async updateContactUs(req, res, next) {
        try {

            const {
                id,
                name,
                email,
                subject,
                message,
                isRead,
                companyId,
            } = req.body;

            const updatedContactUs = await ContactUs.update(
                {
                    name: name,
                    email: email,
                    subject: subject,
                    message: message,
                    isRead: isRead,
                    companyId: companyId,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );

            if (updatedContactUs[0]) {

                const foundContactUs = await ContactUs.findOne({
                    where: {
                        id: id,
                    },
                });

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "ContactUs updated successfully!",
                    contactUs: foundContactUs,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "ContactUs data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating ContactUs!",
                error: error,
            });

        }
    },


    async deleteContactUs(req, res, next) {
        try {

            const contactUsId = req.params.contactUsId;

            const deletedContactUs = await ContactUs.destroy({
                where: {
                    id: contactUsId,
                },
            });

            if (deletedContactUs) {

                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    statusCode: http_status_codes.StatusCodes.ACCEPTED,
                    isSuccess: true,
                    message: "ContactUs deleted successfully!",
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "ContactUs data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in deleting ContactUs!",
                error: error,
            });

        }
    },



    async getOneContactUs(req, res, next) {
        try {

            const contactUsId = req.params.contactUsId;

            const oneContactUs = await ContactUs.findOne({
                where: {
                    id: contactUsId,
                },
            });

            if (oneContactUs) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "One ContactUs data fetched successfully!",
                    contactUs: oneContactUs,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "One ContactUs data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting one ContactUs!",
                error: error,
            });

        }
    },


    async getAllContactUs(req, res, next) {
        try {

            const allContactUs = await ContactUs.findAll({
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "All ContactUs data fetched successfully!",
                contactUs: allContactUs,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting All ContactUs!",
                error: error,
            });

        }
    },

    async getContactUsByCompany(req, res, next) {
        try {

            const companyId = req.params.companyId;

            const contactUsByCompany = await ContactUs.findAll({
                where: {
                    companyId: companyId,
                },
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "ContactUs by Company data fetched successfully!",
                contactUs: contactUsByCompany,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting ContactUs by Company!",
                error: error,
            });

        }
    },


    async getContactUsByFilterWeb(req, res, next) {
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
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            subject: {
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            message: {
                                [Op.like]: `%${search}%`
                            }
                        },
                    ],
                }
            }


            const myWhere = { ...mySearch, ...myCondition };
            const contactUsCount = await ContactUs.count({ where: myWhere, });
            const usFilterResult = paginationFiltrationWeb(req.query, contactUsCount, myWhere);
            const filteredContactUs = await ContactUs.findAll(usFilterResult.filter);

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "ContactUs by filter for web data fetched successfully!",
                contactUs: filteredContactUs,
                pagination: usFilterResult.pagination,
                next: usFilterResult.next,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting ContactUs by filter for web!",
                error: error,
            });

        }
    },



    // =====================================================
    // Website APIs


    async createContactUsOfGl(req, res, next) {
        try {
            const {
                name,
                email,
                subject,
                message,
            } = req.body;

            const companyId = await gamingLabCompanyId();

            const createContactUs = await ContactUs.create({
                name: name,
                email: email,
                subject: subject,
                message: message,
                companyId: companyId,
            });

            return res.status(http_status_codes.StatusCodes.CREATED).json({
                statusCode: http_status_codes.StatusCodes.CREATED,
                isSuccess: true,
                message: "ContactUs of GL created successfully!",
                contactUs: createContactUs,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in creating ContactUs of GL!",
                error: error,
            });

        }
    },

}