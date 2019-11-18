const Sequelize = require('sequelize');
const { db } = require('../connection');

const Person = db.define('person', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    isAttending: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});

module.exports = { Person };
