'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('dung_census', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      herdId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'herds',
          key: 'id',
        },
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
      ratings: {
        type: Sequelize.ARRAY(Sequelize.FLOAT),
        defaultValue: [],
      },
      notes: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('dung_census');
  },
};
