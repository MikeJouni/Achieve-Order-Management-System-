const { DataTypes } = require("sequelize");

const AdminModel = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    profilePhoto: DataTypes.STRING,
    isSuperAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
};

module.exports = (sequelize) => {
    return sequelize.define("admin", AdminModel);
};

// Foreign Keys