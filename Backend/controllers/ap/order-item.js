const http_status_codes = require("http-status-codes");
const { OrderItem } = require("../../database.js");


module.exports = {


    async createOrderItem(req, res, next) {
        try {
            const {
                quantity,
                orderId,
                stockId,
            } = req.body;

            const createOrderItem = await OrderItem.create({
                quantity: quantity,
                orderId: orderId,
                stockId: stockId,
            });

            return res.status(http_status_codes.StatusCodes.CREATED).json({
                statusCode: http_status_codes.StatusCodes.CREATED,
                isSuccess: true,
                message: "OrderItem created successfully!",
                orderItem: createOrderItem,
            });


        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in creating OrderItem!",
                error: error,
            });

        }
    },


    async updateOrderItem(req, res, next) {
        try {

            const {
                id,
                quantity,
                orderId,
                stockId,
            } = req.body;

            const updatedOrderItem = await OrderItem.update(
                {
                    quantity: quantity,
                    orderId: orderId,
                    stockId: stockId,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );

            if (updatedOrderItem[0]) {

                const foundOrderItem = await OrderItem.findOne({
                    where: {
                        id: id,
                    },
                });

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "OrderItem updated successfully!",
                    orderItem: foundOrderItem,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "OrderItem data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating OrderItem!",
                error: error,
            });

        }
    },


    async deleteOrderItem(req, res, next) {
        try {

            const orderItemId = req.params.orderItemId;

            const deletedOrderItem = await OrderItem.destroy({
                where: {
                    id: orderItemId,
                },
            });

            if (deletedOrderItem) {

                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    statusCode: http_status_codes.StatusCodes.ACCEPTED,
                    isSuccess: true,
                    message: "OrderItem deleted successfully!",
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "OrderItem data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in deleting OrderItem!",
                error: error,
            });

        }
    },


    async getOneOrderItem(req, res, next) {
        try {

            const orderItemId = req.params.orderItemId;

            const oneOrderItem = await OrderItem.findOne({
                where: {
                    id: orderItemId,
                },
            });

            if (oneOrderItem) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "One OrderItem data fetched successfully!",
                    orderItem: oneOrderItem,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "One OrderItem data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting one OrderItem!",
                error: error,
            });

        }
    },


    async getAllOrderItems(req, res, next) {
        try {

            const allOrderItems = await OrderItem.findAll({
                orderItem: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "All OrderItems data fetched successfully!",
                orderItems: allOrderItems,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting All OrderItems!",
                error: error,
            });

        }
    },


}