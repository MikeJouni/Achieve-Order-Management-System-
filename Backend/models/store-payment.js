const { DataTypes } = require("sequelize");

const StorePaymentModel = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    detail: DataTypes.TEXT,
    isPaid: DataTypes.BOOLEAN,
};

module.exports = (sequelize) => {
    return sequelize.define("store_payment", StorePaymentModel);
};

// Foreign Keys