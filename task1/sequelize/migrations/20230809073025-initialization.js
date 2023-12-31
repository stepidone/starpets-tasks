'use strict';

const { UserModel } = require('../../src/database/user.entity');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await UserModel.sync({ transaction })
      
      await queryInterface.addConstraint('Users', {
        name: 'users_check_is_balance_positive',
        type: 'check',
        fields: ['balance'],
        where: {
          balance: {
            [Sequelize.Op.gte]: 0
          }
        },
        transaction,
      })

      await queryInterface.sequelize.query(`
        insert into "Users"("id", "balance")
        values ('4c69efc3-35fc-47bf-94f7-cd4d590c6923', 10000)
      `, { transaction })

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },

  async down (queryInterface) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.dropTable('Users', { transaction })
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
};
