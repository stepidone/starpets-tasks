"use strict";

const { ConnectionModel } = require('../../src/database/connection.entity');
const { JobModel } = require('../../src/database/job.entity');
const { LogModel } = require('../../src/database/log.entity');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await ConnectionModel.sync({ transaction })
      await JobModel.sync({ transaction })
      await LogModel.sync({ transaction })

      const mockJobs = [
        {
          name: "every_ten_seconds",
          msInterval: 1000 * 10,
        },
        {
          name: "every_thirty_seconds",
          msInterval: 1000 * 30,
        },
        {
          name: "every_minute",
          msInterval: 1000 * 60,
        },
        {
          name: "every_two_minutes",
          msInterval: 1000 * 60 * 2,
        },
        {
          name: "every_ten_minutes",
          msInterval: 1000 * 60 * 10,
        },
        {
          name: "every_thirty_minutes",
          msInterval: 1000 * 60 * 30,
        },
        {
          name: "every_hour",
          msInterval: 1000 * 60 * 60,
        },
        {
          name: "every_five_hours",
          msInterval: 1000 * 60 * 60 * 5,
        },
        {
          name: "every_day",
          msInterval: 1000 * 60 * 60 * 24,
        },
        {
          name: "every_week",
          msInterval: 1000 * 60 * 60 * 24 * 7,
        },
      ];

      const query = mockJobs.reduce((q, data, i) => {
        if (i) q += ", ";
        return (q += `('${data.name}', ${data.msInterval})`);
      }, 'insert into "Jobs" ("name", "msInterval") values ');

      await queryInterface.sequelize.query(query, { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable("Logs", { transaction });
      await queryInterface.dropTable("Jobs", { transaction });
      await queryInterface.dropTable("Connections", { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
