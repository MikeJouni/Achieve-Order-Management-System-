const { DataTypes } = require("sequelize");

const SliderModel = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fileName: DataTypes.STRING,
};

module.exports = (sequelize) => {
    return sequelize.define("slider", SliderModel);
};

// Foreign Keys
// companyId