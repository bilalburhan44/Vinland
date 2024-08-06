const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbconfig');

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
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  source: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'clients',
});

Client.createClient = async (name, phoneNumber) => {
  return Client.create({ name, phoneNumber });
};

module.exports = Client;
