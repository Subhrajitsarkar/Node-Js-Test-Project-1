const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Book = sequelize.define('Book', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    takenOn: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    returnDue: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    fine: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    returned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

module.exports = Book;
