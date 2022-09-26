'use strict';

module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      /**
       * Herd Data
       */
      const herds = [
        {
          id: '187dc38d-bc3a-4eb4-ac99-74e04de04d48',
          teamId: '6aab56d3-ac8c-4f3b-a59b-c03e51c76e5d', // from earlier seeder
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
  
      /**
       * Cow Census Data
       */
      const cowCensuses = [
        {
          id: '98e8f7d6-f817-44c1-b39a-1ac21be26162',
          herdId: '187dc38d-bc3a-4eb4-ac99-74e04de04d48',
          photoId: 'TODO', // TODO
          bcs: 5,
          notes: 'The quick brown fox jumped over the lazy dog',
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
      await queryInterface.bulkDelete('herds', null, { transaction });
      await queryInterface.bulkDelete('cow_census', null, { transaction });
      await transaction.commit();
    } catch (e) {
      console.log(e);
      await transaction.rollback();
      throw e;
    }
  },
};