'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cow_census', {
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
      bcs: {
        type: Sequelize.ARRAY(Sequelize.FLOAT),
        defaultValue: [],
      },
      notes: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tag: {
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
    await queryInterface.dropTable('cow_census');
  },
};
