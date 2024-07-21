const sequelize = require('../config/dbconfig');
const User = require('./userModel');
const Client = require('./clientModel');
const Transaction = require('./transactionModel');

// Import all models and set up associations
User.hasMany(Transaction, { foreignKey: 'user_id' });
Client.hasMany(Transaction, { foreignKey: 'client_id' });
Transaction.belongsTo(User, { foreignKey: 'user_id' });
Transaction.belongsTo(Client, { foreignKey: 'client_id' });

// Sync all models
sequelize.sync({ force: false }) // Use force: true only in development to reset the database
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(error => {
    console.error('Error creating database & tables:', error);
  });

module.exports = { User, Client, Transaction };
