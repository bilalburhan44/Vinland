const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbconfig');
const User = require('./userModel');

const Transaction = sequelize.define('Transaction', {
  transaction_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  payment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  amount_usd: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  amount_iqd: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  exchange_rate: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 147500,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  freezeTableName: true,
});

Transaction.belongsTo(User, { foreignKey: 'user_id' });



module.exports = Transaction;