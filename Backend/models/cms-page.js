const { DataTypes } = require("sequelize");

const CmsPageModel = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    type: DataTypes.ENUM('about-us', 'privacy-policy', 'terms-and-conditions',),
    text: DataTypes.TEXT,
};

module.exports = (sequelize) => {
    return sequelize.define("cms_page", CmsPageModel);
};

// Foreign Keys
// companyId