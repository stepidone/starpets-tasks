const { Sequelize } = require('sequelize');
const { sequelize } = require("./sequelize");
const { ConnectionModel } = require('./connection.entity');

const JobModel = sequelize.define('Job', {
  name: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  onUseBy: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: ConnectionModel,
      key: 'pid',
    },
    onDelete: 'set null',
    onUpdate: 'set null',
  },
  msInterval: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'Jobs',
  timestamps: false,
  indexes: [
    {
      fields: ['onUseBy'],
    },
  ],
});

ConnectionModel.hasMany(JobModel, { as: 'jobs', foreignKey: 'onUseBy' })
JobModel.belongsTo(ConnectionModel, { as: 'connection', foreignKey: 'onUseBy' })

module.exports = { JobModel }
