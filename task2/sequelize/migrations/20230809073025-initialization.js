"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        "Jobs",
        {
          name: {
            type: Sequelize.STRING,
            primaryKey: true,
          },
          cron: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          onUseBy: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
        },
        { transaction },
      );
      await queryInterface.createTable(
        "JobLogs",
        {
          id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          jobName: {
            type: Sequelize.STRING,
            allowNull: false,
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
        },
        { transaction },
      );
      await queryInterface.addConstraint("JobLogs", {
        type: "foreign key",
        fields: ["jobName"],
        references: {
          table: "Jobs",
          field: "name",
        },
        name: "JobLogs_jobName_fkey",
        onDelete: "cascade",
        onUpdate: "cascade",
        transaction,
      });

      const mockJobs = [
        {
          name: "every_minute",
          cron: "* * * * *",
        },
        {
          name: "every_two_minutes",
          cron: "*/2 * * * *",
        },
        {
          name: "every_ten_minutes",
          cron: "*/10 * * * *",
        },
        {
          name: "every_thirty_minutes",
          cron: "*/30 * * * *",
        },
        {
          name: "every_hour",
          cron: "0 * * * *",
        },
        {
          name: "every_five_hours",
          cron: "0 */5 * * *",
        },
        {
          name: "every_day",
          cron: "0 1 * * *",
        },
        {
          name: "every_week",
          cron: "0 0 * * 0",
        },
        {
          name: "every_month",
          cron: "0 0 1 * *",
        },
        {
          name: "every_year",
          cron: "0 0 1 1 *",
        },
      ];

      const query = mockJobs.reduce((q, data, i) => {
        if (i) q += ", ";
        return (q += `('${data.name}', '${data.cron}')`);
      }, 'insert into "Jobs" ("name", "cron") values ');

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
      await queryInterface.dropTable("JobLogs", { transaction });
      await queryInterface.dropTable("Jobs", { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
