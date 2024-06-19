const { DataTypes } = require("sequelize");

const FaqModel = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    question: DataTypes.TEXT,
    answer: DataTypes.TEXT,
    sortNumber: DataTypes.INTEGER,
};

module.exports = (sequelize) => {
    return sequelize.define("faq", FaqModel);
};

// Foreign Keys
// companyId