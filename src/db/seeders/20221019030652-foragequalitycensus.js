'use strict';

module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      /**
       * ForageQuality Census Data
       */ 
      const forageQualityCensuses = [
        {
          id: 'de3c6ffe-8a36-4964-aa47-b259ea77d20f',
          plotId: '7c175ec1-6822-43d1-962e-8bed235100f6',
          photoId: 'ef57a439-4dad-4010-86cd-b2f9d58183bb',
          rating: 3,
          notes: 'A B C D E',
        },
        {
          id: 'eae632ae-e8cf-4b0c-ac0e-73eda1bcbb09',
          plotId: '7c175ec1-6822-43d1-962e-8bed235100f6',
          photoId: 'ef57a439-4dad-4010-86cd-b2f9d58183bb',
          rating: 5,
          notes: 'F G H I J',
        },
      ];
      await queryInterface.bulkInsert(
        'forage_quality_census',
        forageQualityCensuses.map((forageQualityCensus) => ({
          ...forageQualityCensus,
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
      await queryInterface.bulkDelete('forage_quality_census', null, { transaction });
      await transaction.commit();
    } catch (e) {
      console.log(e);
      await transaction.rollback();
      throw e;
    }
  },
};
