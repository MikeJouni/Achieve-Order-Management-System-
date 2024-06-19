const { DataTypes } = require("sequelize");

const OrderModel = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    uniqueId: DataTypes.STRING,
    status: DataTypes.ENUM(
        'in-progress', // When order created
        'completed', // When order completed
        'cancelled', // When order cancelled
    ),
    totalAmount: {
        type: DataTypes.DOUBLE,
          get() {
            const value = this.getDataValue('totalAmount');
            return value ? parseFloat(value.toFixed(2)) : 0;
        },
        set(value) {
            if (value) {
                this.setDataValue('totalAmount', parseFloat(value.toFixed(2)));
            } else {
                this.setDataValue('totalAmount', 0);
            }
        },
    },
    amount: {
        type: DataTypes.DOUBLE,
          get() {
            const value = this.getDataValue('amount');
            return value ? parseFloat(value.toFixed(2)) : 0;
        },
        set(value) {
            if (value) {
                this.setDataValue('amount', parseFloat(value.toFixed(2)));
            } else {
                this.setDataValue('amount', 0);
            }
        },
    },
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
    cost: {
        type: DataTypes.DOUBLE,
          get() {
            const value = this.getDataValue('cost');
            return value ? parseFloat(value.toFixed(2)) : 0;
        },
        set(value) {
            if (value) {
                this.setDataValue('cost', parseFloat(value.toFixed(2)));
            } else {
                this.setDataValue('cost', 0);
            }
        },
    },
    profit: {
        type: DataTypes.DOUBLE,
          get() {
            const value = this.getDataValue('profit');
            return value ? parseFloat(value.toFixed(2)) : 0;
        },
        set(value) {
            if (value) {
                this.setDataValue('profit', parseFloat(value.toFixed(2)));
            } else {
                this.setDataValue('profit', 0);
            }
        },
    },
    cancelReason: DataTypes.TEXT,
    note: DataTypes.TEXT,
    type: {
        type: DataTypes.ENUM('normal', 'bakery', 'gaming-lab'),
        defaultValue: 'normal',
    },
    orderItemsDetail: {
        type: DataTypes.TEXT,
        defaultValue: '[]',
        get() {
            const rawValue = this.getDataValue('orderItemsDetail');
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
            if (value) {
                this.setDataValue('orderItemsDetail', JSON.stringify(value));
            } else {
                this.setDataValue('orderItemsDetail', '[]');
            }
        },
    },
};

module.exports = (sequelize) => {
    return sequelize.define("order", OrderModel);
};

// Foreign Keys
// customerId
// driverId
