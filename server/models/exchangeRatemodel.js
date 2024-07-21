const sequelize = require('../config/dbconfig');
const { DataTypes } = require('sequelize');
const ExchangeRate = sequelize.define('ExchangeRate', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    rate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.fn('now'),
  },
});

module.exports = ExchangeRate