const {Sequelize} = require('sequelize');
const sequelize = new Sequelize('e-commerce', 'root', 'e_Commerce*', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;
