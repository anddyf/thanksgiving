const Sequelize = require('sequelize');
const { db } = require('../connection');

const Dish = db.define('dish', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false, 
    },
    spoiled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false 
    }
})

module.exports = { Dish };
