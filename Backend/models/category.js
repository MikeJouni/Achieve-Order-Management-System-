const { DataTypes } = require("sequelize");

const CategoryModel = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: DataTypes.STRING,
};

module.exports = (sequelize) => {
    return sequelize.define("category", CategoryModel);
};

// Foreign Keys
// companyId