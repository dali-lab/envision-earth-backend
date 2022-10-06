import { teamService } from 'services';
import db from '../../db/db';
import { ITeam } from 'db/models/team';
import dotenv from 'dotenv';

dotenv.config();

let idTeamA = '';
let idTeamB = '';
const invalidTeamId = '6bff1aab-73ca-4c03-b0bd-5b59f19e31f5';

const idUser = '68b0d858-9e75-49b0-902e-2b587bd9a996'; // from seeder
const existingTeamData: ITeam = {
  id: 'ab9e8aee-0f7b-4ac8-9fd5-5bb982c0367d',
  name: 'Default Team',
};

const teamDataA: Omit<ITeam, 'id'> = {
  name: 'Team A',
};
const teamDataB: Omit<ITeam, 'id'> = {
  name: 'Team B',
};

describe('teamService', () => {
  beforeAll(async () => {
    try {
      await db.authenticate();
      await db.sync();
    } catch (error) {
      console.log(error);
      throw new Error('Unable to connect to database...');
    }
  });
  
  describe('createTeam', () => {
    it('Can create team A', async () => {
      const team: ITeam = await teamService.createTeam(teamDataA);

      expect(team.id).toBeDefined();
      expect(team.name).toBe(teamDataA.name);
      idTeamA = team.id;
    });

    it('Can create team B', async () => {
      const team: ITeam = await teamService.createTeam(teamDataB);

      expect(team.id).toBeDefined();
      expect(team.name).toBe(teamDataB.name);
      idTeamB = team.id;
    });
  });

  describe('getTeams', () => {
    it('Can get team', async () => {
      const team: ITeam = await teamService.getTeams({ id: idTeamA }).then((res: ITeam[]) => res[0]);

      expect(team.id).toBe(idTeamA);
      expect(team.name).toBe(teamDataA.name);
    });

    it('Returns empty array if no teams to get', async () => {
      expect(await teamService.getTeams({ id: invalidTeamId })).toStrictEqual([]);
    });

    it('Can get team by userId', async () => {
      const team: ITeam = await teamService.getTeams({ userId: idUser }).then((res: ITeam[]) => res[0]);

      expect(team.id).toBe(existingTeamData.id);
      expect(team.name).toBe(existingTeamData.name);
    });
  });

  describe('editTeams', () => {
    it('Updates user field', async () => {
      const newName = 'Cool Team A';

      const updatedTeam1: ITeam = await teamService.editTeams({ name: newName }, { id: idTeamA }).then((res: ITeam[]) => res[0]);
      expect(updatedTeam1.name).toBe(newName);

      const updatedUser2: ITeam = await teamService.getTeams({ id: idTeamA }).then((res: ITeam[]) => res[0]);
      expect(updatedUser2.name).toBe(newName);
    });

    it('Returns empty array if no users to edit', async () => {
      expect(await teamService.editTeams({ name: 'Not a real team' }, { id: invalidTeamId })).toStrictEqual([]);
    });
  });

  describe('deleteTeams', () => {
    it('Deletes existing team A', async () => {
      await teamService.deleteTeams({ id: idTeamA });
      expect(await teamService.getTeams({ id: idTeamA })).toStrictEqual([]);
    });
    it('Deletes existing team B', async () => {
      await teamService.deleteTeams({ id: idTeamB });
      expect(await teamService.getTeams({ id: idTeamB })).toStrictEqual([]);
    });

    it('Reports zero deleted rows if no users to delete', async () => {
      expect(await teamService.deleteTeams({ id: invalidTeamId })).toStrictEqual(0);
    });
  });
});
