'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('photos', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      censusId: {
        type: Sequelize.UUID,
        references: {
          model: 'cow_census',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      herdId: {
        type: Sequelize.UUID,
        references: {
          model: 'herds',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      fullUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      thumbUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    // Disconnect the foreign keys
    await queryInterface.dropTable('photos');
  },
};
