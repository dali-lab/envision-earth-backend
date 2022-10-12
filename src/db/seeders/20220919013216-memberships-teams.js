'use strict';

module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      /**
       * Team Data
       */
      const teams = [
        {
          id: '6aab56d3-ac8c-4f3b-a59b-c03e51c76e5d',
          name: 'Test Team',
          acreSize: 100,
          address: '10 N Main St, Hanover, NH 03755',
          yrsRanch: 1,
          yrsHolMang: 1,
          code: 'AAAAAAAA',
        },
        {
          id: 'ab9e8aee-0f7b-4ac8-9fd5-5bb982c0367d',
          acreSize: 400,
          name: 'Default Team',
          address: '15 Thayer Dr, Hanover, NH 03755',
          yrsRanch: 3,
          yrsHolMang: 3,
          code: 'CCCCCCCC',
        },
      ];
      await queryInterface.bulkInsert(
        'teams',
        teams.map((team) => ({
          ...team,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        { transaction },
      );
  
      /**
       * Membership Data
       */
      const memberships = [
        {
          id: 'd97f0c9a-4cb0-47ce-bd49-73b248b81d13',
          teamId: '6aab56d3-ac8c-4f3b-a59b-c03e51c76e5d',
          userId: '62da2543-bf07-4b1a-9d45-a531493d37d9',
          role: 'OWNER',
        },
        {
          id: '908643c2-cab1-4189-9cab-cc54654d2629',
          teamId: 'ab9e8aee-0f7b-4ac8-9fd5-5bb982c0367d',
          userId: '68b0d858-9e75-49b0-902e-2b587bd9a996',
          role: 'OWNER',
        },
      ];
      await queryInterface.bulkInsert(
        'memberships',
        memberships.map((membership) => ({
          ...membership,
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
      await queryInterface.bulkDelete('teams', null, { transaction });
      await queryInterface.bulkDelete('memberships', null, { transaction });
      await transaction.commit();
    } catch (e) {
      console.log(e);
      await transaction.rollback();
      throw e;
    }
  },
};