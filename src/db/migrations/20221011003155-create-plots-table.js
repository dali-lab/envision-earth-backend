'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('plots', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
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
        photoId: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'photos',
            key: 'id',
          },
        },
        latitude: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
        longitude: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
        length: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
        width: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
        name: {
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
      await transaction.commit();
    } catch (err) {
      console.error(err);
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('plots', { transaction });
      await transaction.commit();
    } catch (err) {
      console.error(err);
      await transaction.rollback();
      throw err;
    }
  },
};

