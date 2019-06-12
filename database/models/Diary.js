const {
    connector,
    Sequelize
} = require('../config/dbConfig')
const Group = require('../models/Group')
const Diary = connector.define('diary', {
    body: Sequelize.TEXT
});
Group.hasMany(Diary);
Diary.belongsTo(Group);
module.exports = Diary;