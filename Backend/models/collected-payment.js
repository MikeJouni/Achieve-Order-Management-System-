const { DataTypes } = require("sequelize");

const CollectedPaymentModel = {
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
    amountType: DataTypes.ENUM('dollar', 'lebanese', 'euro'),
};

module.exports = (sequelize) => {
    return sequelize.define("collected_payment", CollectedPaymentModel);
};

// Foreign Keys