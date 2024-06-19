const { DataTypes } = require("sequelize");

const CompanyModel = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: DataTypes.STRING,
    detail: DataTypes.TEXT,
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    licenseExpiryDate: DataTypes.DATEONLY,
    type: {
        type: DataTypes.ENUM('normal', 'bakery', 'gaming-lab'),
        defaultValue: 'normal',
    },
    isProfitCostVisible: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
};

module.exports = (sequelize) => {
    return sequelize.define("company", CompanyModel);
};

// Foreign Keys