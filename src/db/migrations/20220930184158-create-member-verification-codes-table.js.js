'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('membership_verification_codes', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      membershipId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'memberships',
          key: 'id',
        },
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expiration: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('photos');
  },
};
