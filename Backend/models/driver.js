const { DataTypes } = require("sequelize");

const DriverModel = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.TEXT,
    city: DataTypes.STRING,
    barcode: DataTypes.STRING,
};

module.exports = (sequelize) => {
    return sequelize.define("driver", DriverModel);
};

// Foreign Keys