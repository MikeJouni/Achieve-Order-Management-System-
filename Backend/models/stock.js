const { DataTypes } = require("sequelize");

const StockModel = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: DataTypes.STRING,
    fileName: DataTypes.STRING,
    price: {
        type: DataTypes.DOUBLE,
          get() {
            const value = this.getDataValue('price');
            return value ? parseFloat(value.toFixed(2)) : 0;
        },
        set(value) {
            if (value) {
                this.setDataValue('price', parseFloat(value.toFixed(2)));
            } else {
                this.setDataValue('price', 0);
            }
        },
    },
    quantity: DataTypes.INTEGER,
    cost: {
        type: DataTypes.DOUBLE,
          get() {
            const value = this.getDataValue('cost');
            return value ? parseFloat(value.toFixed(2)) : 0;
        },
        set(value) {
            if (value) {
                this.setDataValue('cost', parseFloat(value.toFixed(2)));
            } else {
                this.setDataValue('cost', 0);
            }
        },
    },
    profit: {
        type: DataTypes.DOUBLE,
          get() {
            const value = this.getDataValue('profit');
            return value ? parseFloat(value.toFixed(2)) : 0;
        },
        set(value) {
            if (value) {
                this.setDataValue('profit', parseFloat(value.toFixed(2)));
            } else {
                this.setDataValue('profit', 0);
            }
        },
    },
    source: DataTypes.STRING,
    note: DataTypes.TEXT,
    barcode: DataTypes.STRING,
    isVisible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    isUnlimitedQty: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isVisibleToWebsite: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
};

module.exports = (sequelize) => {
    return sequelize.define("stock", StockModel);
};

// Foreign Keys