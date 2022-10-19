'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('forage_quality_census', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      plotId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'plots',
          key: 'id',
        },
      },
      photoId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'photos',
          key: 'id',
        },
      },
      rating: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      notes: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('forage_quality_census');
  },
};
