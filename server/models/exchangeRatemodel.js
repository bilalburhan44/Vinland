const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbconfig');

const ExchangeRate = sequelize.define('exchangerates', {
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
}, {
  tableName: 'exchangerates',
});

module.exports = ExchangeRate;
