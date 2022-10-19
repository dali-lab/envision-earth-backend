'use strict';

module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      /**
       * Photo Data
       */
      const photos = [
        {
          id: 'ef57a439-4dad-4010-86cd-b2f9d58183bb',
          fullUrl: 'https://envision-earth-bucket.s3.amazonaws.com/1665188889040_full.jpeg',
        },
      ];
      await queryInterface.bulkInsert(
        'photos',
        photos.map((photo) => ({
          ...photo,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        { transaction },
      );
      
      /**
       * Herd Data
       */
      const herds = [
        {
          id: '187dc38d-bc3a-4eb4-ac99-74e04de04d48',
          teamId: 'ab9e8aee-0f7b-4ac8-9fd5-5bb982c0367d', // from seeder
          breed: 'Holstein Friesian',
          count: 21,
          breedingDate: new Date('2022-01-21 21:50:56.305-04'),
          calvingDate: new Date('2022-07-21 21:50:56.305-04'),
        },
      ];
      await queryInterface.bulkInsert(
        'herds',
        herds.map((herd) => ({
          ...herd,
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
      await queryInterface.bulkDelete('photos', null, { transaction });
      await queryInterface.bulkDelete('herds', null, { transaction });
      await transaction.commit();
    } catch (e) {
      console.log(e);
      await transaction.rollback();
      throw e;
    }
  },
};