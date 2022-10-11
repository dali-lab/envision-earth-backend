'use strict';

module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      /**
       * Plot Data
       */
      const plots = [
        {
          id: 'a647d30f-964e-40e6-85e2-07404f50f1e4',
          teamId: '6aab56d3-ac8c-4f3b-a59b-c03e51c76e5d',
          photoId: null,
          latitude: 43.734856908426046,
          longitude: -72.25190850357757,
          length: 20,
          width: 20,
          name: 'Test Plot',
        },
        {
          id: '7c175ec1-6822-43d1-962e-8bed235100f6',
          teamId: 'ab9e8aee-0f7b-4ac8-9fd5-5bb982c0367d',
          photoId: 'ef57a439-4dad-4010-86cd-b2f9d58183bb',
          latitude: 43.734173892145556,
          longitude: -72.24597964116084,
          length: 20,
          width: 20,
          name: 'Default Plot',
        },
      ];
      await queryInterface.bulkInsert(
        'plots',
        plots.map((plot) => ({
          ...plot,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        { transaction },
      );
      await transaction.commit();
    } catch (e) {
      console.log(e);
      await transaction.rollback();
      throw e;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('plots', null, { transaction });
      await transaction.commit();
    } catch (e) {
      console.log(e);
      await transaction.rollback();
      throw e;
    }
  },
};
