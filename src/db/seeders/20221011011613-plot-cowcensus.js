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

      /**
       * Cow Census Data
       */
      const cowCensuses = [
        {
          id: '98e8f7d6-f817-44c1-b39a-1ac21be26162',
          herdId: '187dc38d-bc3a-4eb4-ac99-74e04de04d48',
          plotId: '7c175ec1-6822-43d1-962e-8bed235100f6',
          photoId: 'ef57a439-4dad-4010-86cd-b2f9d58183bb',
          bcs: [1, 2, 8],
          notes: 'The quick brown fox jumped over the lazy dog',
          tag: 'qwerty',
        },
        {
          id: 'd3e2319b-b38b-4b9f-8667-be0911c212b9',
          herdId: '187dc38d-bc3a-4eb4-ac99-74e04de04d48',
          plotId: '7c175ec1-6822-43d1-962e-8bed235100f6',
          photoId: 'ef57a439-4dad-4010-86cd-b2f9d58183bb',
          bcs: [2, 4, 6],
          notes: 'There can be multiple cow censuses!',
          tag: 'qwerty',
        },
      ];
      await queryInterface.bulkInsert(
        'cow_census',
        cowCensuses.map((cowCensus) => ({
          ...cowCensus,
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
      await queryInterface.bulkDelete('cow_census', null, { transaction });
      await queryInterface.bulkDelete('plots', null, { transaction });
      await transaction.commit();
    } catch (e) {
      console.log(e);
      await transaction.rollback();
      throw e;
    }
  },
};
