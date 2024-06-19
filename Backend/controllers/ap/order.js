const http_status_codes = require("http-status-codes");
const { Order, Stock, OrderItem, Customer, Driver, Company, Admin, CustomerDebt } = require("../../database.js");
const { createActivity } = require("../../services/activity.js");
const { randomNumbersGenerator, dateStatementReturn } = require("../../services/utils.js");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const moment = require("moment");


module.exports = {


    async createOrder(req, res, next) {
        try {
            const {
                type,
                customerId,
                driverId,
                employeeId,
                companyId,
                note,
                orderItems,
                isAmountNotPaid,
            } = req.body;

            var stocksMainTotalAmountWODisc = 0;
            var stocksTotalAmount = 0;
            var stocksTotalCost = 0;
            var stocksTotalProfit = 0;
            var stocksTotalDiscount = 0;

            const stockIdArray = orderItems.map(item => {
                return item.stockId
            });

            const zeroQtyStocksCount = await Stock.count({
                where: {
                    id: stockIdArray,
                    quantity: 0,
                    isUnlimitedQty: false,
                },
            })

            if (orderItems.length != zeroQtyStocksCount) {

                var changedStockItems = false;

                await orderItems.forEach(async (element, ind) => {

                    const myStock = await Stock.findOne({
                        where: {
                            id: element.stockId,
                        },
                        attributes: ['id', 'price', 'cost', 'profit', 'quantity', 'isUnlimitedQty']
                    })

                    if (myStock) {

                        if (!myStock.isUnlimitedQty && myStock.quantity < element.quantity) {
                            orderItems[ind].quantity = await myStock.quantity;
                            changedStockItems = true;
                        }

                        stocksMainTotalAmountWODisc += myStock.price * element.quantity;
                        stocksTotalCost += myStock.cost * element.quantity;
                        stocksTotalAmount += (myStock.price - element.discount) * element.quantity;
                        stocksTotalProfit += (myStock.profit - element.discount) * element.quantity;
                        stocksTotalDiscount += element.discount * element.quantity;

                        if (!myStock.isUnlimitedQty) {

                            await Stock.update(
                                {
                                    quantity: myStock.quantity - element.quantity,
                                },
                                {
                                    where: {
                                        id: element.stockId,
                                    }
                                }
                            )

                        }

                    }


                    if (ind == orderItems.length - 1) {

                        const createdOrder = await Order.create({
                            uniqueId: randomNumbersGenerator(6),
                            type: type,
                            note: note,
                            status: 'in-progress',
                            totalAmount: stocksMainTotalAmountWODisc,
                            amount: stocksTotalAmount,
                            discount: stocksTotalDiscount,
                            cost: stocksTotalCost,
                            profit: stocksTotalProfit,
                            customerId: customerId,
                            driverId: driverId,
                            companyId: companyId,
                        });

                        const orderItemsArray = await orderItems.map(item => {
                            item["orderId"] = createdOrder.id;
                            return item;
                        });

                        await OrderItem.bulkCreate(orderItemsArray);

                        await createActivity({
                            collectedPaymentId: null,
                            companyId: companyId,
                            customerId: customerId,
                            driverId: null,
                            employeeId: employeeId,
                            orderId: createdOrder.id,
                            stockId: null,
                            storePaymentId: null,
                            type: employeeId ? 'employee-created-order' : 'admin-created-order',
                        });

                        if (isAmountNotPaid) {
                            const createCustomerDebt = await CustomerDebt.create({
                                amount: stocksTotalAmount,
                                date: new Date(),
                                companyId: companyId,
                                customerId: customerId,
                                orderId: createdOrder.id,
                            });

                            await createActivity({
                                collectedPaymentId: null,
                                companyId: companyId,
                                customerId: customerId,
                                customerDebtId: createCustomerDebt.id,
                                driverId: null,
                                employeeId: null,
                                orderId: createdOrder.id,
                                stockId: null,
                                storePaymentId: null,
                                type: 'customer-debt-created-for-order',
                            });
                        }


                        const foundOrder = await Order.findOne({
                            where: {
                                id: createdOrder.id,
                            },
                            include: {
                                all: true,
                            }
                        })

                        const orderItemsAndStocks = await Order.findOne({
                            where: {
                                id: createdOrder.id,
                            },
                            include: {
                                model: OrderItem,
                                include: {
                                    model: Stock,
                                }
                            },
                            attributes: [],
                        })

                        await Order.update(
                            {
                                orderItemsDetail: orderItemsAndStocks.order_Items,
                            },
                            {
                                where: {
                                    id: createdOrder.id,
                                }
                            }
                        )

                        if (changedStockItems) {
                            return res.status(http_status_codes.StatusCodes.CREATED).json({
                                status_code: http_status_codes.StatusCodes.CREATED,
                                isSuccess: true,
                                message: "Order created with different quantities successfully!",
                                order: createdOrder,
                            });
                        } else {
                            return res.status(http_status_codes.StatusCodes.CREATED).json({
                                status_code: http_status_codes.StatusCodes.CREATED,
                                isSuccess: true,
                                message: "Order created successfully!",
                                foundOrder: foundOrder,
                                order: createdOrder,
                            });
                        }
                    }

                })

            } else {

                return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                    status_code: http_status_codes.StatusCodes.CONFLICT,
                    status: "error",
                    message: "Order cannot be created due to unavailable stock!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in creating Order!",
                error: error,
            });

        }
    },


    async updateOrderStatus(req, res, next) {
        try {

            const {
                id,
                status,
                employeeId,
            } = req.body;

            const myOrder = await Order.findOne({
                where: {
                    id: id
                },
                attributes: ['companyId'],
            })

            if (status != 'cancelled') {

                const updatedOrder = await Order.update(
                    {
                        status: status,
                        cancelReason: null,
                    },
                    {
                        where: {
                            id: id,
                        },
                    }
                );

                if (updatedOrder[0]) {

                    var myType = '';

                    if (status == 'in-progress') {
                        myType = employeeId ? 'employee-updated-order-in-progress' : 'admin-updated-order-in-progress';
                    } else if (status == 'completed') {
                        myType = employeeId ? 'employee-updated-order-completed' : 'admin-updated-order-completed';
                    } else if (status == 'cancelled') {
                        myType = employeeId ? 'employee-updated-order-cancelled' : 'admin-updated-order-cancelled';
                    }

                    await createActivity({
                        collectedPaymentId: null,
                        companyId: myOrder.companyId,
                        customerId: null,
                        driverId: null,
                        employeeId: employeeId,
                        orderId: id,
                        stockId: null,
                        storePaymentId: null,
                        type: myType,
                    });

                    return res.status(http_status_codes.StatusCodes.OK).json({
                        statusCode: http_status_codes.StatusCodes.OK,
                        isSuccess: true,
                        message: "Order status updated successfully!",
                    });

                } else {

                    return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                        statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                        isSuccess: false,
                        message: "Order data not found!",
                    });

                }


            } else {

                return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                    status_code: http_status_codes.StatusCodes.CONFLICT,
                    status: "error",
                    message: "Order cannot be marked as cancelled from here!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in updating Order Status!",
                error: error,
            });

        }
    },


    async deleteOrder(req, res, next) {
        try {

            const orderId = req.params.orderId;

            const {
                employeeId
            } = req.query;

            const myOrder = await Order.findOne({
                where: {
                    id: orderId,
                },
                attributes: ['companyId'],
            })

            if (myOrder) {

                await createActivity({
                    collectedPaymentId: null,
                    companyId: myOrder.companyId,
                    customerId: null,
                    driverId: null,
                    employeeId: (employeeId && employeeId != 'null') ? employeeId : null,
                    orderId: orderId,
                    stockId: null,
                    storePaymentId: null,
                    type: (employeeId && employeeId != 'null') ? 'employee-deleted-order' : 'admin-deleted-order',
                });

                await OrderItem.destroy({
                    where: {
                        orderId: orderId,
                    }
                })

                const deletedOrder = await Order.destroy({
                    where: {
                        id: orderId,
                    },
                });

                if (deletedOrder) {

                    return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                        statusCode: http_status_codes.StatusCodes.ACCEPTED,
                        isSuccess: true,
                        message: "Order deleted successfully!",
                    });

                } else {

                    return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                        statusCode: http_status_codes.StatusCodes.CONFLICT,
                        isSuccess: false,
                        message: "Order not updated!",
                    });

                }
            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "Order data not found!",
                });

            }


        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in deleting Order!",
                error: error,
            });

        }
    },


    async getOrderDetail(req, res, next) {
        try {

            const orderId = req.params.orderId;

            const oneOrderDetail = await Order.findOne({
                where: {
                    id: orderId,
                },
                include: [
                    {
                        model: OrderItem,
                        include: {
                            model: Stock,
                        }
                    },
                    {
                        model: Customer,
                    },
                    {
                        model: Company,
                        attributes: ['adminId', 'name'],
                        include: {
                            model: Admin,
                            attributes: ['profilePhoto']
                        }
                    },
                    {
                        model: Driver,
                    },
                ]
            });

            if (oneOrderDetail) {

                return res.status(http_status_codes.StatusCodes.OK).json({
                    statusCode: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "One Order data fetched successfully!",
                    order: oneOrderDetail,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    statusCode: http_status_codes.StatusCodes.NOT_FOUND,
                    isSuccess: false,
                    message: "One Order data not found!",
                });

            }

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting one Order!",
                error: error,
            });

        }
    },


    async cancelReCancelOrder(req, res, next) {
        try {

            const { id, status, cancelReason, employeeId } = req.body;

            const myOrder = await Order.findOne({
                where: {
                    id: id
                },
                attributes: ['status', 'companyId'],
            })

            if (status == 'cancelled') {

                if (myOrder.status == 'in-progress') {

                    await Order.update(
                        {
                            status: 'cancelled',
                            cancelReason: cancelReason,
                        },
                        {
                            where: {
                                id: id,
                            },
                        }
                    );

                    const orderItemsList = await OrderItem.findAll({
                        where: {
                            orderId: id,
                        },
                        include: {
                            model: Stock,
                            required: false,
                            attributes: ['quantity'],
                        }
                    })

                    orderItemsList.forEach(async (element) => {

                        if (element.stock) {

                            await Stock.update(
                                {
                                    quantity: element.stock.quantity + element.quantity,
                                },
                                {
                                    where: {
                                        id: element.stockId,
                                    }
                                }
                            )

                        }

                    })

                    var myType = '';

                    if (status == 'in-progress') {
                        myType = employeeId ? 'employee-updated-order-in-progress' : 'admin-updated-order-in-progress';
                    } else if (status == 'completed') {
                        myType = employeeId ? 'employee-updated-order-completed' : 'admin-updated-order-completed';
                    } else if (status == 'cancelled') {
                        myType = employeeId ? 'employee-updated-order-cancelled' : 'admin-updated-order-cancelled';
                    }

                    await createActivity({
                        collectedPaymentId: null,
                        companyId: myOrder.companyId,
                        customerId: null,
                        driverId: null,
                        employeeId: employeeId,
                        orderId: id,
                        stockId: null,
                        storePaymentId: null,
                        type: myType,
                    });

                    return res.status(http_status_codes.StatusCodes.OK).json({
                        status_code: http_status_codes.StatusCodes.OK,
                        isSuccess: true,
                        message: "Order cancelled successfully!",
                    });

                } else {

                    return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                        status_code: http_status_codes.StatusCodes.CONFLICT,
                        status: "error",
                        message: "Order cannot be cancelled!",
                    });

                }


            } else {

                await Order.update(
                    {
                        status: status,
                        cancelBy: null,
                        cancelReason: null,
                    },
                    {
                        where: {
                            id: id,
                        },
                    }
                );

                const orderItems = await OrderItem.findAll({
                    where: {
                        orderId: id
                    },
                    include: {
                        model: Stock,
                        required: false,
                        attributes: ['quantity']
                    }
                })


                if (orderItems) {

                    await orderItems.forEach(async (element) => {

                        await Stock.update(
                            {
                                quantity: element.stock.quantity - element.quantity,
                            },
                            {
                                where: {
                                    id: element.stockId,
                                }
                            }
                        )
                    })

                }

                var myType = '';

                if (status == 'in-progress') {
                    myType = employeeId ? 'employee-updated-order-in-progress' : 'admin-updated-order-in-progress';
                } else if (status == 'completed') {
                    myType = employeeId ? 'employee-updated-order-completed' : 'admin-updated-order-completed';
                } else if (status == 'cancelled') {
                    myType = employeeId ? 'employee-updated-order-cancelled' : 'admin-updated-order-cancelled';
                }

                await createActivity({
                    collectedPaymentId: null,
                    companyId: myOrder.companyId,
                    customerId: null,
                    driverId: null,
                    employeeId: employeeId,
                    orderId: id,
                    stockId: null,
                    storePaymentId: null,
                    type: myType,
                });


                return res.status(http_status_codes.StatusCodes.OK).json({
                    status_code: http_status_codes.StatusCodes.OK,
                    isSuccess: true,
                    message: "Order status changed successfully!",
                });
            }

        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    status_code: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                    isSuccess: false,
                    message: "Error occurred in cancelling / re-cancelling Order!",
                    error: error,
                });
        }
    },


    // async getOrdersByStatus(req, res, next) {
    //     try {

    //         const orderStatus = req.params.orderStatus;

    //         const orderStatusList = [
    //             'in-progress',
    //             'completed',
    //             'cancelled',
    //         ];

    //         if (orderStatusList.includes(orderStatus)) {

    //             const ordersByStatus = await Order.findAll({
    //                 where: {
    //                     status: orderStatus,
    //                 },
    //                 order: [["createdAt", "DESC"]],
    //             });

    //             return res.status(http_status_codes.StatusCodes.OK).json({
    //                 statusCode: http_status_codes.StatusCodes.OK,
    //                 isSuccess: true,
    //                 message: "Orders by Status data fetched successfully!",
    //                 orders: ordersByStatus,
    //             });

    //         } else {

    //             return res.status(http_status_codes.StatusCodes.CONFLICT).json({
    //                 statusCode: http_status_codes.StatusCodes.CONFLICT,
    //                 isSuccess: true,
    //                 message: "Order Status is incorrect!",
    //                 types: orderStatusList,
    //             });

    //         }


    //     } catch (error) {

    //         return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
    //             statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
    //             isSuccess: false,
    //             message: "Error occurred in getting Orders by Status!",
    //             error: error,
    //         });

    //     }
    // },


    async getOrdersByCustomer(req, res, next) {
        try {

            const customerId = req.params.customerId;

            const ordersByCustomer = await Order.findAll({
                where: {
                    customerId: customerId,
                },
                order: [["createdAt", "DESC"]],
                attributes: {
                    exclude: ['orderItemsDetail'],
                },
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "Orders by Customer data fetched successfully!",
                orders: ordersByCustomer,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting Orders by Customer!",
                error: error,
            });

        }
    },


    async getOrdersByDriver(req, res, next) {
        try {

            const driverId = req.params.driverId;

            const ordersByDriver = await Order.findAll({
                where: {
                    driverId: driverId,
                },
                order: [["createdAt", "DESC"]],
                attributes: {
                    exclude: ['orderItemsDetail'],
                },
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "Orders by Driver data fetched successfully!",
                orders: ordersByDriver,
            });

        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting Orders by Driver!",
                error: error,
            });

        }
    },


    async getOrdersByCompanyAndDate(req, res, next) {
        try {

            const {
                date,
                fromDate,
                toDate,
                type,
                orderType,
                companyId,
            } = req.query;

            var whereStatement = {};

            whereStatement = dateStatementReturn(req.query);

            const inProgressOrders = await Order.findAll({
                where: {
                    companyId: companyId,
                    status: 'in-progress',
                    type: orderType,
                    ...whereStatement
                },
                include: {
                    model: Customer,
                    attributes: [],
                },
                attributes: {
                    include: [
                        [sequelize.col('customer.name'), 'customerName']
                    ],
                    exclude: ['orderItemsDetail'],
                },
                order: [["createdAt", "DESC"]],
            });


            const completedOrders = await Order.findAll({
                where: {
                    companyId: companyId,
                    status: 'completed',
                    type: orderType,
                    ...whereStatement
                },
                include: {
                    model: Customer,
                    attributes: [],
                },
                attributes: {
                    include: [
                        [sequelize.col('customer.name'), 'customerName']
                    ],
                    exclude: ['orderItemsDetail'],
                },
                order: [["createdAt", "DESC"]],
            });

            const cancelledOrders = await Order.findAll({
                where: {
                    companyId: companyId,
                    status: 'cancelled',
                    type: orderType,
                    ...whereStatement
                },
                include: {
                    model: Customer,
                    attributes: [],
                },
                attributes: {
                    include: [
                        [sequelize.col('customer.name'), 'customerName']
                    ],
                    exclude: ['orderItemsDetail'],
                },
                order: [["createdAt", "DESC"]],
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                statusCode: http_status_codes.StatusCodes.OK,
                isSuccess: true,
                message: "Orders by Company and Date data fetched successfully!",
                orders: {
                    inProgress: inProgressOrders,
                    completed: completedOrders,
                    cancelled: cancelledOrders,
                },
            });


        } catch (error) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                message: "Error occurred in getting Orders by Company and Date!",
                error: error,
            });

        }
    },


}