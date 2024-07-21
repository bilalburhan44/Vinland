const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbconfig');

const Payment = sequelize.define('Payment', {
  transaction_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  initial_payment_usd: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  monthly_payment_usd: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  initial_payment_iqd: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  monthly_payment_iqd: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  total_amount_usd: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  total_amount_iqd: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
});

module.exports = Payment;