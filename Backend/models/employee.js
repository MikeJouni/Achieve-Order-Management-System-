const { DataTypes } = require("sequelize");

const EmployeeModel = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    profilePhoto: DataTypes.STRING,
};

module.exports = (sequelize) => {
    return sequelize.define("employee", EmployeeModel);
};

// Foreign Keys