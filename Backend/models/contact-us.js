const { DataTypes } = require("sequelize");

const ContactUsModel = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    subject: DataTypes.STRING,
    message: DataTypes.TEXT,
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false, },
};

module.exports = (sequelize) => {
    return sequelize.define("contact_us", ContactUsModel);
};

// Foreign Keys
// companyId