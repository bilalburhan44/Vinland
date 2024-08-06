// projectModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbconfig');
const Transaction = require('./transactionModel');
const Client = require('./clientModel');
const User = require('./userModel');

const Project = sequelize.define('Project', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    project_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    expectedIncome:{
        type: DataTypes.FLOAT,
        allowNull: true,
        unique:false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Client,
            key: 'id',
        },
    },
    user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});



module.exports = Project;