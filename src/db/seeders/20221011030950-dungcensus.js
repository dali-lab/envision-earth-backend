'use strict';

module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      /**
       * Dung Census Data
       */ 
      const dungCensuses = [
        {
          id: '9147ad31-a5a1-42ca-a338-c65644d698da',
          herdId: '187dc38d-bc3a-4eb4-ac99-74e04de04d48',
          plotId: '7c175ec1-6822-43d1-962e-8bed235100f6',
          photoId: 'ef57a439-4dad-4010-86cd-b2f9d58183bb',
          ratings: [-1, 0, 1],
          notes: 'The quick brown fox jumped over the lazy dog',
        },
        {
          id: 'e7a5eba0-4c07-47e4-9298-3cee4c91ab45',
          herdId: '187dc38d-bc3a-4eb4-ac99-74e04de04d48',
          plotId: '7c175ec1-6822-43d1-962e-8bed235100f6',
          photoId: 'ef57a439-4dad-4010-86cd-b2f9d58183bb',
          ratings: [0.1, 0.2, 0.4],
          notes: 'There can be multiple dung censuses!',
        },
      ];
      await queryInterface.bulkInsert(
        'dung_census',
        dungCensuses.map((dungCensus) => ({
          ...dungCensus,
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
      await queryInterface.bulkDelete('dung_census', null, { transaction });
      await transaction.commit();
    } catch (e) {
      console.log(e);
      await transaction.rollback();
      throw e;
    }
  },
};

