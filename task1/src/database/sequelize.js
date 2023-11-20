const { Sequelize } = require('sequelize');
const { configurations } = require("../config/config");

const { dbUrl } = configurations
const sequelize = new Sequelize(dbUrl, {
  logging: false,
})

module.exports = { sequelize }
