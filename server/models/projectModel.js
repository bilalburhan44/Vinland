// projectModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbconfig');
const Transaction = require('./transactionModel');
const Client = require('./clientModel');

const Project = sequelize.define('Project', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    projectDescription: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expectedIncome: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    realIncome: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    transaction_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Transaction,
            key: 'transaction_id',
        },
    }
});


Project.belongsTo(Transaction, { foreignKey: 'transaction_id' });

module.exports = Project;