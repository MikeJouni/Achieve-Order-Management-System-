const http_status_codes = require("http-status-codes");
var multer = require('multer');
const fs = require('fs');
const { multerFileUploader } = require("../services/utils");

module.exports = {

    async uploadFile(req, res, next) {
        try {
            if (fs.existsSync('./Files/')) {

                const fileUploadResult = await multerFileUploader(req.file);

                if (fileUploadResult) {

                    return res.status(http_status_codes.StatusCodes.OK).json(fileUploadResult);

                } else {

                    return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                        statusCode: http_status_codes.StatusCodes.CONFLICT,
                        isSuccess: false,
                        message: "Error occurred in uploading File!",
                    });

                }

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    status_code: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "Folder not found!",
                });

            }
        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status_code: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in uploading File!",
                error: error,
            });

        }
    },



    async removeFile(req, res, next) {
        try {

            const fileName = req.params.fileName;
            const file = './Files/' + fileName;

            if (fs.existsSync(file)) {

                await fs.unlinkSync(file);

                return res.status(http_status_codes.StatusCodes.CREATED).json({
                    status_code: http_status_codes.StatusCodes.CREATED,
                    isSuccess: true,
                    message: "File removed successfully!",
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    status_code: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "File not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status_code: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in removing File!",
                error: error,
            });

        }
    },


};
