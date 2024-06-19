const http_status_codes = require("http-status-codes");
const { Faq } = require("../../database.js");
const { createActivity } = require("../../services/activity.js");
const { isValueNotNull, paginationFiltrationWeb, gamingLabCompanyId } = require("../../services/utils.js");
const { Op } = require("sequelize");


module.exports = {


    async createFaq(req, res, next) {
        try {
            const {
                question,
                answer,
                sortNumber,
                companyId,
            } = req.body;

            const createFaq = await Faq.create({
                question: question,
                answer: answer,
                sortNumber: sortNumber,
                companyId: companyId,
            });

            return res.status(http_status_codes.StatusCodes.CREATED).json({
                statusCode: http_status_codes.StatusCodes.CREATED,
                isSuccess: true,
                message: "Faq created successfully!",
                faq: createFaq,
            });


        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in creating Faq!",
                error: error,
            });

        }
    },


    async updateFaq(req, res, next) {
        try {

            const {
                id,
                question,
                answer,
                sortNumber,
                companyId,
            } = req.body;

            const updatedFaq = await Faq.update(
                {
                    question: question,
                    answer: answer,
                    sortNumber: sortNumber,
                    companyId: companyId,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );

            if (updatedFaq[0]) {

                const foundFaq = await Faq.findOne({
                    where: {
                        id: id,
                    },
                });

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "Faq updated successfully!",
                    faq: foundFaq,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "Faq data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating Faq!",
                error: error,
            });

        }
    },


    async deleteFaq(req, res, next) {
        try {

            const faqId = req.params.faqId;

            const deletedFaq = await Faq.destroy({
                where: {
                    id: faqId,
                },
            });

            if (deletedFaq) {

                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    statusCode: http_status_codes.StatusCodes.ACCEPTED,
                    isSuccess: true,
                    message: "Faq deleted successfully!",
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "Faq data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in deleting Faq!",
                error: error,
            });

        }
    },


    async getOneFaq(req, res, next) {
        try {

            const faqId = req.params.faqId;

            const oneFaq = await Faq.findOne({
                where: {
                    id: faqId,
                },
            });

            if (oneFaq) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "One Faq data fetched successfully!",
                    faq: oneFaq,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "One Faq data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting one Faq!",
                error: error,
            });

        }
    },


    async getAllFaqs(req, res, next) {
        try {

            const allFaqs = await Faq.findAll({
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "All Faqs data fetched successfully!",
                faqs: allFaqs,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting All Faqs!",
                error: error,
            });

        }
    },


    async getFaqsByCompany(req, res, next) {
        try {

            const companyId = req.params.companyId;

            const faqsByCompany = await Faq.findAll({
                where: {
                    companyId: companyId,
                },
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "Faqs by Company data fetched successfully!",
                faqs: faqsByCompany,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting Faqs by Company!",
                error: error,
            });

        }
    },


    async getFaqsByFilterWeb(req, res, next) {
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
                            question: {
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            answer: {
                                [Op.like]: `%${search}`
                            }
                        },
                    ],
                }
            }

            const myWhere = { ...mySearch, ...myCondition };
            const faqsCount = await Faq.count({ where: myWhere, });
            const pageFilterResult = paginationFiltrationWeb(req.query, faqsCount, myWhere);
            const filteredFaqs = await Faq.findAll(pageFilterResult.filter);

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "Faqs by filter for web data fetched successfully!",
                faqs: filteredFaqs,
                pagination: pageFilterResult.pagination,
                next: pageFilterResult.next,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting Faqs by filter for web!",
                error: error,
            });

        }
    },


    async getAllFaqsSorted(req, res, next) {
        try {

            const allFaqs = await Faq.findAll({
                order: [["sortNumber", "ASC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "All Faqs sorted data fetched successfully!",
                faqs: allFaqs,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting All Faqs sorted!",
                error: error,
            });

        }
    },


    async updateFaqSortNumbers(req, res, next) {
        try {

            const {
                faqIds,
            } = req.body;

            await faqIds.forEach(async (item, ind) => {
                await Faq.update(
                    {
                        sortNumber: ind + 1,
                    },
                    {
                        where: {
                            id: item,
                        },
                    }
                );
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "Faq sortNumbers updated successfully!",
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating Faq sortNumbers!",
                error: error,
            });

        }
    },

    // =====================================================
    // Website APIs    

    async getAllFaqsOfGL(req, res, next) {
        try {

            const companyId = await gamingLabCompanyId();

            const allFaqs = await Faq.findAll({
                companyId: companyId,
                order: [["sortNumber", "ASC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "All Faqs of GL data fetched successfully!",
                faqs: allFaqs,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting All Faqs of GL!",
                error: error,
            });

        }
    },


}