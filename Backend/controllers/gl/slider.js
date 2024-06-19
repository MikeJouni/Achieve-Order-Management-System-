const http_status_codes = require("http-status-codes");
const { Slider, Order, OrderItem, Category } = require("../../database.js");
const { createActivity } = require("../../services/activity.js");
const { multerFileUploader, fileRemover, gamingLabCompanyId, isValueNotNull, paginationFiltrationWeb } = require("../../services/utils.js");
const { Op } = require("sequelize");
const { multipleFilesUploadManager } = require("../../services/file.js");

module.exports = {


    async createSlider(req, res, next) {
        try {
            const {
                fileName,
                categoryId,
            } = req.body;

            const createSlider = await Slider.create({
                fileName: fileName,
                categoryId: categoryId,
            });

            return res.status(http_status_codes.StatusCodes.CREATED).json({
                statusCode: http_status_codes.StatusCodes.CREATED,
                isSuccess: true,
                message: "Slider created successfully!",
                slider: createSlider,
            });


        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in creating Slider!",
                error: error,
            });

        }
    },


    async updateSlider(req, res, next) {
        try {

            const {
                id,
                // fileName,
                categoryId,
            } = req.body;

            const updatedSlider = await Slider.update(
                {
                    // fileName: fileName,
                    categoryId: categoryId,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );

            if (updatedSlider[0]) {

                const foundSlider = await Slider.findOne({
                    where: {
                        id: id,
                    },
                });

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "Slider updated successfully!",
                    slider: foundSlider,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "Slider data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating Slider!",
                error: error,
            });

        }
    },



    async updateSliderFile(req, res, next) {
        try {

            const sliderId = req.params.sliderId;

            const mySlider = await Slider.findOne({
                where: {
                    id: sliderId
                },
                attributes: ['fileName']
            })

            if (mySlider) {

                const fileUploadResult = await multerFileUploader(req.file);

                if (fileUploadResult) {

                    await Slider.update(
                        {
                            fileName: fileUploadResult,
                        },
                        {
                            where: {
                                id: sliderId,
                            },
                        }
                    );

                    if (mySlider.fileName) {
                        fileRemover(mySlider.fileName)
                    }

                    const foundSlider = await Slider.findOne({
                        where: {
                            id: sliderId,
                        },
                    });

                    return res.status(http_status_codes.StatusCodes.OK).json({
                        statusCode: http_status_codes.StatusCodes.OK,
                        isSuccess: true,
                        message: "Slider FileName updated successfully!",
                        slider: foundSlider,
                    });

                } else {

                    return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                        statusCode: http_status_codes.StatusCodes.CONFLICT,
                        isSuccess: false,
                        message: "Error occurred in uploading File!",
                    });

                }


            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "Slider data not found!",
                });

            }


        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating Slider File!",
                error: error,
            });

        }
    },



    async addMultipleSlidersByCompany(req, res, next) {
        try {

            const companyId = req.params.companyId;
            const myFiles = req.files;

            const fileUploadResults = await multipleFilesUploadManager(myFiles);

            if (fileUploadResults) {

                const slidersArray = fileUploadResults.map(item => {
                    return {
                        fileName: item,
                        companyId: companyId,
                    }
                })

                const addSlider = await Slider.bulkCreate(slidersArray);

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "Multiple Sliders added successfully!",
                    slider: addSlider,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                    statusCode: http_status_codes.StatusCodes.CONFLICT,
                    isSuccess: false,
                    message: "Error occurred in uploading Files!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in adding multiple Sliders by company!",
                error: error,
            });

        }
    },


    async deleteSlider(req, res, next) {
        try {

            const sliderId = req.params.sliderId;

            const mySlider = await Slider.findOne({
                where: {
                    id: sliderId
                },
                attributes: ['fileName'],
            })

            const deletedSlider = await Slider.destroy({
                where: {
                    id: sliderId,
                },
            });

            if (deletedSlider) {

                if (mySlider.fileName) {
                    await fileRemover(mySlider.fileName);
                }

                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    statusCode: http_status_codes.StatusCodes.ACCEPTED,
                    isSuccess: true,
                    message: "Slider deleted successfully!",
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "Slider data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in deleting Slider!",
                error: error,
            });

        }
    },


    async getAllSliders(req, res, next) {
        try {

            const allSliders = await Slider.findAll({
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "All Sliders data fetched successfully!",
                sliders: allSliders,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting All Sliders!",
                error: error,
            });

        }
    },


    async getSlidersByCompany(req, res, next) {
        try {

            const companyId = req.params.companyId;

            const slidersByCompany = await Slider.findAll({
                where: {
                    companyId: companyId,
                },
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "Sliders by company data fetched successfully!",
                sliders: slidersByCompany,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting Sliders by company!",
                error: error,
            });

        }
    },



    async getSlidersByFilterWeb(req, res, next) {
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

            // if (isValueNotNull(search)) {
            //     mySearch = {
            //         [Op.or]: [
            //             {
            //                 fileName: {
            //                     [Op.like]: `%${search}`
            //                 }
            //             },
            //         ],
            //     }
            // }

            const myWhere = { ...mySearch, ...myCondition };
            const slidersCount = await Slider.count({ where: myWhere, });
            const pageFilterResult = paginationFiltrationWeb(req.query, slidersCount, myWhere);
            const filteredSliders = await Slider.findAll(pageFilterResult.filter);

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "Sliders by filter for web data fetched successfully!",
                sliders: filteredSliders,
                pagination: pageFilterResult.pagination,
                next: pageFilterResult.next,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting Sliders by filter for web!",
                error: error,
            });

        }
    },



}