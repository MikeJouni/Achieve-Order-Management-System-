const { DataTypes } = require("sequelize");

const FavoriteStockModel = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
};

module.exports = (sequelize) => {
    return sequelize.define("favorite_stock", FavoriteStockModel);
};

// Foreign Keys
// customerId
// stockId