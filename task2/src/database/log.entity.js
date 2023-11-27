const { Sequelize } = require('sequelize');
const { sequelize } = require("./sequelize");
const { JobModel } = require('./job.entity');

const LogModel = sequelize.define('Log', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  jobName: {
    type: Sequelize.STRING,
    allowNull: false,
    references: {
      model: JobModel,
      key: 'name',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  },
  runnedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal("now()"),
    allowNull: false,
  },
  completedAt: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  runnedBy: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'Logs',
  timestamps: false,
  indexes: [
    {
      fields: ['jobName'],
    },
  ],
});

JobModel.hasMany(LogModel, { as: 'logs', foreignKey: 'jobName' })
LogModel.belongsTo(JobModel, { as: 'job', foreignKey: 'jobName' })

module.exports = { LogModel }
