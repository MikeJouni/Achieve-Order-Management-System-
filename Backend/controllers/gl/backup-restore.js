const http_status_codes = require("http-status-codes");
const { fileRemover, databaseBackupFileName, fileDestination, databaseBackupFileNameGenerator } = require('../../services/utils');
const sequelize_custom_import_export = require('../../services/sequelize-custom-import-export');
const { Activity, Admin, CollectedPayment, Company, CustomVariable, CustomerDebt, Customer, Driver, Employee, NoteReminder, OrderItem, Order, Stock, StorePayment, syncDatabaseTables } = require('../../database');
const allDatabaseModels = new sequelize_custom_import_export({ Activity, Admin, CollectedPayment, Company, CustomVariable, CustomerDebt, Customer, Driver, Employee, NoteReminder, OrderItem, Order, Stock, StorePayment });
const companyDatabaseModels = new sequelize_custom_import_export({ Activity, CollectedPayment, Customer, CustomerDebt, Driver, Employee, NoteReminder, Order, Stock, StorePayment, });
const fs = require("fs");

module.exports = {


    async backupDatabase(req, res, next) {
        try {

            const fileName = databaseBackupFileNameGenerator();
            const filePath = fileDestination + fileName;

            await allDatabaseModels.export(filePath);

            // Remove file after 1 minute
            setTimeout(() => {
                fileRemover(fileName);
            }, 60 * 1000);

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "Database Backup done successfully!",
                fileName: fileName,
            });

            // return res.status(http_status_codes.StatusCodes.OK).download(filePath, (err) => {

            //     // Delete the file after it's sent
            //     fileRemover(fileName);

            //     if (err) {
            //         res.status(http_status_codes.StatusCodes.CONFLICT).json({
            //             statusCode: http_status_codes.StatusCodes.CONFLICT,
            //             isSuccess: false,
            //             message: "Something went wrong while Backing Up Database!",
            //             error: err,
            //         });
            //     }

            // });



        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in Backing Up Database!",
                error: error,
            });

        }
    },

    async backupDatabaseByCompany(req, res, next) {
        try {

            const companyId = req.params.companyId;

            const fileName = databaseBackupFileNameGenerator();
            const filePath = fileDestination + fileName;

            await companyDatabaseModels.exportByCompany(filePath, companyId);

            // Remove file after 1 minute
            setTimeout(() => {
                fileRemover(fileName);
            }, 60 * 1000);

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "Database Backup by Company done successfully!",
                fileName: fileName,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in Backing Up Database by Company!",
                error: error,
            });

        }
    },

    async restoreDatabase(req, res, next) {
        try {

            const file = req.file;

            if (!file) {
                return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                    statusCode: http_status_codes.StatusCodes.CONFLICT,
                    isSuccess: false,
                    message: "No Backup file uploaded!",
                });
            }

            const fileName = file.originalname;
            // const filePath = fileDestination + databaseBackupFileName;
            const filePath = fileDestination + fileName;
            fs.renameSync(file.path, filePath);

            if (fs.existsSync(filePath)) {

                await syncDatabaseTables();

                // Restore two times because one time is not working correctly
                await allDatabaseModels.import(filePath);
                await allDatabaseModels.import(filePath);

                // Remove file after 1 minute
                setTimeout(() => {
                    // fileRemover(databaseBackupFileName);
                    fileRemover(fileName);
                }, 60 * 1000);

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "Database Restored successfully!",
                });

            } else {

                return res.status(http_status_codes.StatusCodes.BAD_GATEWAY).json({
                    statusCode: http_status_codes.StatusCodes.BAD_GATEWAY,
                    isSuccess: false,
                    message: "Database file not found!",
                });

            }


        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in Restoring Database!",
                error: error,
            });

        }
    },




}