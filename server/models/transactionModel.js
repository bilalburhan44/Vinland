const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbconfig');
const User = require('./userModel');
const Client = require('./clientModel');
const ExchangeRate = require('./exchangeRatemodel');
const Project = require('./projectModel');

const Transaction = sequelize.define('transactions', {
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
    allowNull: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Client,
      key: 'id',
    },
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Project,
      key: 'id',
    },
  },
  rate_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ExchangeRate,
      key: 'id',
    },
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
  tableName: 'transactions',
});


module.exports = Transaction;
