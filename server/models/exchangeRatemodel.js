const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbconfig');

const ExchangeRate = sequelize.define('exchangerate', {
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
  indexes: [
    {
      unique: true,
      fields: ['rate'],
    },
  ],
});

module.exports = ExchangeRate;
