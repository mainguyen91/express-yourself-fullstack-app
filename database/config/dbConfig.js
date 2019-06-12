require('dotenv').config();

const Sequelize = require('sequelize');

// Configure DB
const connector = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres'
});

// Authenticate that we can connect to the DB
connector
    .authenticate()
    .then(() => console.log(`Authentication to ${process.env.DB_NAME} is successful`))
    .catch(error => console.log(`Could not authenticate connection to ${process.env.DB_NAME}`));

module.exports = {
    Sequelize,
    connector
};