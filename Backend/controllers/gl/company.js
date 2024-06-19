const http_status_codes = require("http-status-codes");
const { Company } = require("../../database.js");
const { multerFileUploader, fileRemover, isValueNotNull, paginationFiltrationWeb } = require("../../services/utils.js");
const { Op } = require("sequelize");


module.exports = {


    async createCompany(req, res, next) {
        try {
            const {
                name,
                detail,
                licenseExpiryDate,
                type,
                adminId,
            } = req.body;

            const createCompany = await Company.create({
                name: name,
                detail: detail,
                licenseExpiryDate: licenseExpiryDate,
                type: type,
                adminId: adminId,
            });

            return res.status(http_status_codes.StatusCodes.CREATED).json({
                statusCode: http_status_codes.StatusCodes.CREATED,
                isSuccess: true,
                message: "Company created successfully!",
                company: createCompany,
            });


        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in creating Company!",
                error: error,
            });

        }
    },


    async updateCompany(req, res, next) {
        try {

            const {
                id,
                name,
                detail,
                licenseExpiryDate,
                type,
                adminId,
            } = req.body;

            const updatedCompany = await Company.update(
                {
                    name: name,
                    detail: detail,
                    licenseExpiryDate: licenseExpiryDate,
                    type: type,
                    adminId: adminId,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );

            if (updatedCompany[0]) {

                const foundCompany = await Company.findOne({
                    where: {
                        id: id,
                    },
                });

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "Company updated successfully!",
                    company: foundCompany,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "Company data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating Company!",
                error: error,
            });

        }
    },


    async updateCompanyDeleted(req, res, next) {
        try {

            const {
                id,
                isDeleted,
            } = req.body;

            const updatedCompany = await Company.update(
                {
                    isDeleted: isDeleted,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );

            if (updatedCompany[0]) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: `Company ${isDeleted ? 'Deleted' : 'Undeleted'} successfully!`,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "Company data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating Company Deleted!",
                error: error,
            });

        }
    },


    async updateCompanyProfitCostVisible(req, res, next) {
        try {

            const {
                id,
                isProfitCostVisible,
            } = req.body;

            const updatedCompany = await Company.update(
                {
                    isProfitCostVisible: isProfitCostVisible,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );

            if (updatedCompany[0]) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: `Profit Cost successfully made ${isProfitCostVisible ? 'Visible' : 'Invisible'}!`,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "Company data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating Profit Cost Visible!",
                error: error,
            });

        }
    },



    async deleteCompany(req, res, next) {
        try {

            const companyId = req.params.companyId;

            const deletedCompany = await Company.destroy({
                where: {
                    id: companyId,
                },
            });

            if (deletedCompany) {

                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    statusCode: http_status_codes.StatusCodes.ACCEPTED,
                    isSuccess: true,
                    message: "Company deleted successfully!",
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "Company data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in deleting Company!",
                error: error,
            });

        }
    },


    async getOneCompany(req, res, next) {
        try {

            const companyId = req.params.companyId;

            const oneCompany = await Company.findOne({
                where: {
                    id: companyId,
                },
            });

            if (oneCompany) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "One Company data fetched successfully!",
                    company: oneCompany,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "One Company data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting one Company!",
                error: error,
            });

        }
    },


    async getOneCompanyProfitCostVisible(req, res, next) {
        try {

            const companyId = req.params.companyId;

            const oneCompany = await Company.findOne({
                where: {
                    id: companyId,
                },
                attributes: ['isProfitCostVisible'],
            });

            if (oneCompany) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "One Company Profit Cost Visible data fetched successfully!",
                    isProfitCostVisible: oneCompany.isProfitCostVisible,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "One Company data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting one Company Profit Cost Visible!",
                error: error,
            });

        }
    },


    async getAllCompanies(req, res, next) {
        try {

            const allCompanies = await Company.findAll({
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "All Companies data fetched successfully!",
                companies: allCompanies,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting All Companies!",
                error: error,
            });

        }
    },


    async getCompaniesByDeleted(req, res, next) {
        try {

            const isDeleted = req.params.isDeleted;

            const isDeletedCompanies = await Company.findAll({
                where: {
                    isDeleted: JSON.parse(isDeleted),
                },
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "Companies by Deleted data fetched successfully!",
                companies: isDeletedCompanies,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting Companies by Deleted!",
                error: error,
            });

        }
    },







    async getCompaniesByFilterWeb(req, res, next) {
        try {

            const {
                page,
                size,
                sort,
                order,
                search,
            } = req.query;

            var mySearch = {};
            var myCondition = {};

            if (isValueNotNull(search)) {
                mySearch = {
                    [Op.or]: [
                        {
                            name: {
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            detail: {
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            licenseExpiryDate: {
                                [Op.like]: `%${search}%`
                            }
                        },
                    ],
                }
            }

            const myWhere = { ...mySearch, ...myCondition };
            const companiesCount = await Company.count({ where: myWhere, });
            const pageFilterResult = paginationFiltrationWeb(req.query, companiesCount, myWhere);
            const filteredCompanies = await Company.findAll(pageFilterResult.filter);

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "Companies by filter for web data fetched successfully!",
                companies: filteredCompanies,
                pagination: pageFilterResult.pagination,
                next: pageFilterResult.next,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting Companies by filter for web!",
                error: error,
            });

        }
    },


}