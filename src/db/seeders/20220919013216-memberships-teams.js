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