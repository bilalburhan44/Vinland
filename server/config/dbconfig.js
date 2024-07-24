require('dotenv').config();
const { Sequelize } = require('sequelize');

// Ensure you have the correct environment variables set in your .env file
const sequelize = new Sequelize( process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  port: process.env.DB_PORT || 3306,
  timezone: '+03:00', // Adjust the timezone offset for Baghdad
  logging: false, // Disable logging
  define: {
    timestamps: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000, // Default pool acquire timeout
    idle: 10000,
  },
  dialectOptions: {
    connectTimeout: 60000 // Increase connection timeout to 60 seconds
  },
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
 
  Object.keys(sequelize.models).forEach(modelName => {
    if (sequelize.models[modelName].associate) {
      sequelize.models[modelName].associate(sequelize.models);
    }
  });
  
// sequelize.sync({ alter: true }) // This will sync the models with the database
// .then(() => {
//   console.log('Database synchronized');
// })
// .catch((error) => {
//   console.error('Error synchronizing database:', error);
// });

module.exports = sequelize;
