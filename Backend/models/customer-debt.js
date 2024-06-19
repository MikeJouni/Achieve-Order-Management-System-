const { DataTypes } = require("sequelize");

const CustomerDebtModel = {
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
    date: DataTypes.DATEONLY,
    description: DataTypes.TEXT,
};

module.exports = (sequelize) => {
    return sequelize.define("customer_debt", CustomerDebtModel);
};

// Foreign Keys
// companyId
// customerId
// orderId