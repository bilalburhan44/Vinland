require('dotenv').config();
const { Sequelize } = require('sequelize');

// Ensure you have the correct environment variables set in your .env file
const sequelize = new Sequelize('vinland', 'root', '', {
  host: 'localhost',
  dialect: 'mysql' // Add this line to specify the dialect
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
 
// sequelize.sync({ alter: true }) // This will sync the models with the database
// .then(() => {
//   console.log('Database synchronized');
// })
// .catch((error) => {
//   console.error('Error synchronizing database:', error);
// });

module.exports = sequelize;