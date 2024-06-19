const { DataTypes } = require("sequelize");

const OrderItemModel = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    quantity: DataTypes.INTEGER,
    discount: {
        type: DataTypes.DOUBLE,
        get() {
            const value = this.getDataValue('discount');
            return value ? parseFloat(value.toFixed(2)) : 0;
        },
        set(value) {
            if (value) {
                this.setDataValue('discount', parseFloat(value.toFixed(2)));
            } else {
                this.setDataValue('discount', 0);
            }
        },
    },
};

module.exports = (sequelize) => {
    return sequelize.define("order_Item", OrderItemModel, { timestamp: false });
};

// Foreign Keys
// orderId
// stockId