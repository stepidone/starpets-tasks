const { Sequelize } = require('sequelize');
const { sequelize } = require("./sequelize");

const ConnectionModel = sequelize.define('Connection', {
  pid: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  lastHeartbeat: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('now()'),
    allowNull: false,
  },
}, {
  tableName: 'Connections',
  timestamps: false,
});

module.exports = { ConnectionModel }
