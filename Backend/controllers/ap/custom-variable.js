const http_status_codes = require("http-status-codes");
const { CustomVariable } = require("../../database");
const { fileRemover, multerFileUploader, multerFileUploaderWithoutCompress } = require('../../services/utils');

module.exports = {


    async updateLoginBackground(req, res, next) {
        try {

            const variableType = 'login-background-image';

            const fileUploadResult = await multerFileUploaderWithoutCompress(req.file);

            if (fileUploadResult) {

                const myCustomVariable = await CustomVariable.findOne({
                    where: {
                        type: variableType
                    },
                    attributes: ['stringValue']
                })

                if (myCustomVariable) {

                    await CustomVariable.update(
                        {
                            stringValue: fileUploadResult,
                        },
                        {
                            where: {
                                type: variableType
                            },
                        }
                    );

                    if (myCustomVariable.stringValue) {
                        fileRemover(myCustomVariable.stringValue)
                    }

                } else {

                    await CustomVariable.create({
                        type: variableType,
                        stringValue: fileUploadResult,
                    });

                }


                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "Login Background Image updated successfully!",
                    loginBackgroundImage: fileUploadResult,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                    statusCode: http_status_codes.StatusCodes.CONFLICT,
                    isSuccess: false,
                    message: "Error occurred in uploading Login Background Image!",
                });

            }



        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating Login Background Image!",
                error: error,
            });

        }
    },



    async getLoginBackground(req, res, next) {
        try {

            const variableType = 'login-background-image';

            const oneCustomVariable = await CustomVariable.findOne({
                where: {
                    type: variableType,
                },
            });

            if (oneCustomVariable) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "Login Background Image data fetched successfully!",
                    loginBackgroundImage: oneCustomVariable.stringValue,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "Login Background Image data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting login Background Image!",
                error: error,
            });

        }
    },


    async createCustomVariable(req, res, next) {
        try {
            const {
                stringValue,
                integerValue,
            } = req.body;

            const createCustomVariable = await CustomVariable.create({
                stringValue: stringValue,
                integerValue: integerValue,
            });

            return res.status(http_status_codes.StatusCodes.CREATED).json({
                statusCode: http_status_codes.StatusCodes.CREATED,
                isSuccess: true,
                message: "CustomVariable created successfully!",
                customVariable: createCustomVariable,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in creating CustomVariable!",
                error: error,
            });

        }
    },



    async updateCustomVariable(req, res, next) {
        try {

            const {
                id,
                stringValue,
                integerValue,
            } = req.body;

            const updatedCustomVariable = await CustomVariable.update(
                {
                    stringValue: stringValue,
                    integerValue: integerValue,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );

            if (updatedCustomVariable[0]) {

                const foundCustomVariable = await CustomVariable.findOne({
                    where: {
                        id: id,
                    },
                });

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "CustomVariable updated successfully!",
                    customVariable: foundCustomVariable,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "CustomVariable data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating CustomVariable!",
                error: error,
            });

        }
    },


    async deleteCustomVariable(req, res, next) {
        try {

            const customVariableId = req.params.customVariableId;

            const myCustomVariable = await CustomVariable.findOne({
                where: {
                    id: customVariableId
                },
                attributes: ['stringValue'],
            })

            const deletedCustomVariable = await CustomVariable.destroy({
                where: {
                    id: customVariableId,
                },
            });

            if (deletedCustomVariable) {

                if (myCustomVariable.stringValue) {
                    await fileRemover(myCustomVariable.stringValue);
                }

                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    statusCode: http_status_codes.StatusCodes.ACCEPTED,
                    isSuccess: true,
                    message: "CustomVariable deleted successfully!",
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "CustomVariable data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in deleting CustomVariable!",
                error: error,
            });

        }
    },



    async getOneCustomVariable(req, res, next) {
        try {

            const customVariableId = req.params.customVariableId;

            const oneCustomVariable = await CustomVariable.findOne({
                where: {
                    id: customVariableId,
                },
            });

            if (oneCustomVariable) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "One CustomVariable data fetched successfully!",
                    customVariable: oneCustomVariable,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "One CustomVariable data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting one CustomVariable!",
                error: error,
            });

        }
    },



    async getAllCustomVariables(req, res, next) {
        try {

            const allCustomVariables = await CustomVariable.findAll({
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "All CustomVariables data fetched successfully!",
                customVariables: allCustomVariables,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting All CustomVariables!",
                error: error,
            });

        }
    },



}