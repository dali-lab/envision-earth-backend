import { membershipService } from 'services';
import db from '../../db/db';
import { IMembership } from 'db/models/membership';
import { TeamScopes } from 'db/models/team';
import dotenv from 'dotenv';

dotenv.config();

const idTeam = '6aab56d3-ac8c-4f3b-a59b-c03e51c76e5d'; // from seeder
const idUser = '68b0d858-9e75-49b0-902e-2b587bd9a996'; // from seeder

let idMembership = '';
const invalidMembershipId = 'a2856caa-0384-47e3-a292-f2f8ca90b8d7';

const membershipData: Omit<IMembership, 'id'> = {
  teamId: idTeam,
  userId: idUser,
  role: TeamScopes.User,
};

describe('membershipService', () => {
  beforeAll(async () => {
    try {
      await db.authenticate();
      await db.sync();
    } catch (error) {
      console.log(error);
      throw new Error('Unable to connect to database...');
    }
  });
  
  describe('createMembership', () => {
    it('Can create team', async () => {
      const membership: IMembership = await membershipService.createMembership(membershipData);

      expect(membership.id).toBeDefined();
      expect(membership.teamId).toBe(membershipData.teamId);
      expect(membership.userId).toBe(membershipData.userId);
      expect(membership.role).toBe(membership.role);
      idMembership = membership.id;
    });
  });

  describe('getMemberships', () => {
    it('Can get membership', async () => {
      const membership: IMembership = await membershipService.getMemberships({ id: idMembership }).then((res: IMembership[]) => res[0]);

      expect(membership.id).toBe(idMembership);
      expect(membership.teamId).toBe(membershipData.teamId);
      expect(membership.userId).toBe(membershipData.userId);
      expect(membership.role).toBe(membershipData.role);
    });

    it('Returns empty array if no memberships to get', async () => {
      expect(await membershipService.getMemberships({ id: invalidMembershipId })).toStrictEqual([]);
    });
  });

  describe('editMemberships', () => {
    it('Updates membership field', async () => {
      const updatedMembership1: IMembership = await membershipService.editMemberships({ role: TeamScopes.Contributor }, { id: idMembership }).then((res: IMembership[]) => res[0]);
      expect(updatedMembership1.id).toBe(idMembership);
      expect(updatedMembership1.teamId).toBe(membershipData.teamId);
      expect(updatedMembership1.userId).toBe(membershipData.userId);
      expect(updatedMembership1.role).toBe(TeamScopes.Contributor);

      const updatedMembership2: IMembership = await membershipService.getMemberships({ id: idMembership }).then((res: IMembership[]) => res[0]);
      expect(updatedMembership2.id).toBe(idMembership);
      expect(updatedMembership2.teamId).toBe(membershipData.teamId);
      expect(updatedMembership2.userId).toBe(membershipData.userId);
      expect(updatedMembership2.role).toBe(TeamScopes.Contributor);
    });

    it('Returns empty array if no memberships to edit', async () => {
      expect(await membershipService.editMemberships({ role: TeamScopes.Contributor }, { id: invalidMembershipId })).toStrictEqual([]);
    });
  });

  describe('deleteMemberships', () => {
    it('Deletes existing membership', async () => {
      await membershipService.deleteMemberships({ id: idMembership });
      expect(await membershipService.getMemberships({ id: idMembership })).toStrictEqual([]);
    });

    it('Reports zero deleted rows if no memberships to delete', async () => {
      expect(await membershipService.deleteMemberships({ id: invalidMembershipId })).toStrictEqual(0);
    });
  });
});
