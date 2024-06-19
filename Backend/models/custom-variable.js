const { DataTypes } = require("sequelize");

const CustomVariableModel = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    type: {
        type: DataTypes.ENUM,
        values: ['login-background-image'],
    },
    stringValue: DataTypes.STRING,
    integerValue: {
        type: DataTypes.DOUBLE,
        get() {
            const value = this.getDataValue('integerValue');
            return value ? parseFloat(value.toFixed(2)) : 0;
        },
        set(value) {
            if (value) {
                this.setDataValue('integerValue', parseFloat(value.toFixed(2)));
            } else {
                this.setDataValue('integerValue', 0);
            }
        },
    },
};

module.exports = (sequelize) => {
    return sequelize.define("custom_variable", CustomVariableModel);
};

// Foreign Keys