const { DataTypes } = require("sequelize");

const NoteReminderModel = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    note: DataTypes.TEXT,
    to: DataTypes.TEXT,
    dueDate: DataTypes.DATEONLY,
};

module.exports = (sequelize) => {
    return sequelize.define("note_reminder", NoteReminderModel);
};

// Foreign Keys
// companyId