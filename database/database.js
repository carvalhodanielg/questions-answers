const Sequelize = require('sequelize');

const connection = new Sequelize('qa','root','password',{
    host: 'localhost',
    dialect: 'mysql'
})//qa é o  bd criado no mysqle

module.exports = connection;
