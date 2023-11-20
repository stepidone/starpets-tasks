const { Sequelize } = require('sequelize');
const { sequelize } = require("./sequelize");

const UserModel = sequelize.define('user', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal('gen_random_uuid()'),
  },
  balance: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'Users',
  timestamps: false,
});

module.exports = { UserModel }
