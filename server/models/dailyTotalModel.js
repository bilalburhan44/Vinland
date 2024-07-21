const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbconfig');

const DailyTotal = sequelize.define('DailyTotal', {
  date: {
    type: DataTypes.DATEONLY,
    primaryKey: true,
  },
  totalAmountUSD: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  totalAmountIQD: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = DailyTotal;