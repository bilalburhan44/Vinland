// clientModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbconfig');
const Transaction = require('./transactionModel');
const Project = require('./projectModel');

const Client = sequelize.define('Client', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    
});

Client.createClient = async (name, phoneNumber) => {
    return Client.create({ name, phoneNumber });
};


module.exports = Client;