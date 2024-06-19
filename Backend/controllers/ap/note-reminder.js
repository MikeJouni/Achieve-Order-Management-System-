const http_status_codes = require("http-status-codes");
const { NoteReminder } = require("../../database.js");


module.exports = {


    async createNoteReminder(req, res, next) {
        try {
            const {
                note,
                to,
                dueDate,
                companyId,
            } = req.body;

            const createNoteReminder = await NoteReminder.create({
                note: note,
                to: to,
                dueDate: dueDate,
                companyId: companyId,
            });

            return res.status(http_status_codes.StatusCodes.CREATED).json({
                statusCode: http_status_codes.StatusCodes.CREATED,
                isSuccess: true,
                message: "NoteReminder created successfully!",
                noteReminder: createNoteReminder,
            });


        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in creating NoteReminder!",
                error: error,
            });

        }
    },



    async updateNoteReminder(req, res, next) {
        try {

            const {
                id,
                note,
                to,
                dueDate,
                companyId,
            } = req.body;

            const updatedNoteReminder = await NoteReminder.update(
                {
                    note: note,
                    to: to,
                    dueDate: dueDate,
                    companyId: companyId,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );

            if (updatedNoteReminder[0]) {

                const foundNoteReminder = await NoteReminder.findOne({
                    where: {
                        id: id,
                    },
                });

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "NoteReminder updated successfully!",
                    noteReminder: foundNoteReminder,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "NoteReminder data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating NoteReminder!",
                error: error,
            });

        }
    },



    async deleteNoteReminder(req, res, next) {
        try {

            const noteReminderId = req.params.noteReminderId;

            const deletedNoteReminder = await NoteReminder.destroy({
                where: {
                    id: noteReminderId,
                },
            });

            if (deletedNoteReminder) {

                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    statusCode: http_status_codes.StatusCodes.ACCEPTED,
                    isSuccess: true,
                    message: "NoteReminder deleted successfully!",
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "NoteReminder data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in deleting NoteReminder!",
                error: error,
            });

        }
    },



    async getOneNoteReminder(req, res, next) {
        try {

            const noteReminderId = req.params.noteReminderId;

            const oneNoteReminder = await NoteReminder.findOne({
                where: {
                    id: noteReminderId,
                },
            });

            if (oneNoteReminder) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "One NoteReminder data fetched successfully!",
                    noteReminder: oneNoteReminder,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "One NoteReminder data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting one NoteReminder!",
                error: error,
            });

        }
    },



    async getAllNoteReminders(req, res, next) {
        try {

            const allNoteReminders = await NoteReminder.findAll({
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "All NoteReminders data fetched successfully!",
                noteReminders: allNoteReminders,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting All NoteReminders!",
                error: error,
            });

        }
    },



    async getNoteRemindersByCompany(req, res, next) {
        try {

            const companyId = req.params.companyId;

            const allNoteRemindersByCompany = await NoteReminder.findAll({
                where: {
                    companyId: companyId,
                },
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "All NoteReminders by Company data fetched successfully!",
                noteReminders: allNoteRemindersByCompany,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting All NoteReminders by Company!",
                error: error,
            });

        }
    },

}