'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('herds', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      teamId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'teams',
          key: 'id',
        },
      },
      species: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      count: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      breedingDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      calvingDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('herds');
  },
};
