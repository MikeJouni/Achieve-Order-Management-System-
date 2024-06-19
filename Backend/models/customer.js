const { DataTypes } = require("sequelize");

const CustomerModel = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    password: DataTypes.STRING,
    address: DataTypes.TEXT,
    city: DataTypes.STRING,
    isBlocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
};

module.exports = (sequelize) => {
    return sequelize.define("customer", CustomerModel);
};

// Foreign Keys