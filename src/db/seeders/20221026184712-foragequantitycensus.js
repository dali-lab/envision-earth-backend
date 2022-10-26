'use strict';

module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      /**
       * ForageQuantity Census Data
       */ 
      const forageQuantityCensuses = [
        {
          id: '92b92737-b7f1-4a8a-a1a1-e7adf6e4609d',
          plotId: '7c175ec1-6822-43d1-962e-8bed235100f6',
          photoId: 'ef57a439-4dad-4010-86cd-b2f9d58183bb',
          sda: 3,
          notes: 'Q R S T U',
        },
        {
          id: '63ac58b7-abcf-4b3a-9b18-8bccb54a0bda',
          plotId: '7c175ec1-6822-43d1-962e-8bed235100f6',
          photoId: 'ef57a439-4dad-4010-86cd-b2f9d58183bb',
          sda: 5,
          notes: 'V W X Y Z',
        },
      ];
      await queryInterface.bulkInsert(
        'forage_quantity_census',
        forageQuantityCensuses.map((forageQuantityCensus) => ({
          ...forageQuantityCensus,
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
      await queryInterface.bulkDelete('forage_quantity_census', null, { transaction });
      await transaction.commit();
    } catch (e) {
      console.log(e);
      await transaction.rollback();
      throw e;
    }
  },
};
