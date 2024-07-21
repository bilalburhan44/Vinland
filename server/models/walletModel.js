const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbconfig');
const DailyTotal = require('./dailyTotalModel');

const Wallet = sequelize.define('Wallet', {
  totalAmountUSD: {
    type: DataTypes.FLOAT,
    allowNull: false,
    
  },
  totalAmountIQD: {
    type: DataTypes.FLOAT,
    allowNull: false,
    
  },
});

// Define association between Wallet and DailyTotal
Wallet.hasMany(DailyTotal, { foreignKey: 'walletId' });
DailyTotal.belongsTo(Wallet, { foreignKey: 'walletId' });

module.exports = Wallet;