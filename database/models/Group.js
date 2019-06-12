const {
    connector,
    Sequelize
} = require('../config/dbConfig')

const Group = connector.define('group', {
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING
});
module.exports = Group;