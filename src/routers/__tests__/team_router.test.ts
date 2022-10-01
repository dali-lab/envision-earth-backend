import supertest from 'supertest';
import teamRouter from 'routers/team_router';
import { teamService } from 'services';
import db from '../../db/db';
import { ITeam } from '../../db/models/team';

const request = supertest(teamRouter);

const teamDataA: Omit<ITeam, 'id'> = {
  name: 'Team A',
};

const teamDataB: Omit<ITeam, 'id'> = {
  name: 'Team B',
};

let validId = '';
const invalidId = '4e86ecda-baaf-4ad4-b1a5-04eaaa0c3252';

const idUser = '68b0d858-9e75-49b0-902e-2b587bd9a996'; // from seeder
const existingTeamData: ITeam = {
  id: 'ab9e8aee-0f7b-4ac8-9fd5-5bb982c0367d',
  name: 'Default Team',
};

// Mocks requireAuth server middleware
jest.mock('../../auth/requireAuth');
jest.mock('../../auth/requireScope');
jest.mock('../../auth/requireMembership');
jest.mock('../../auth/requireSelf');

describe('Working team router', () => {
  beforeAll(async () => {
    try {
      await db.authenticate();
      await db.sync();
    } catch (error) {
      throw new Error('Unable to connect to database...');
    }
  });

  describe('POST /', () => {
    it('requires valid permissions', async () => {
      const createSpy = jest.spyOn(teamService, 'createTeam');

      const res = await request
        .post('/')
        .send(teamDataA);

      expect(res.status).toBe(403);
      expect(createSpy).not.toHaveBeenCalled();
    });

    it('blocks creation when missing field', async () => {
      const createSpy = jest.spyOn(teamService, 'createTeam');

      const attempts = Object.keys(teamDataA).map(async (key) => {
        const team = { ...teamDataA };
        delete team[key];

        const res = await request
          .post('/')
          .set('Authorization', 'Bearer dummy_token')
          .send(team);

        expect(res.status).toBe(500);
        expect(res.body.errors.length).toBe(1);
        expect(createSpy).not.toHaveBeenCalled();
      });
      await Promise.all(attempts);
    });

    it('blocks creation when field invalid', async () => {
      const createSpy = jest.spyOn(teamService, 'createTeam');

      const attempts = Object.keys(teamDataA).map(async (key) => {
        const team = { ...teamDataA };
        team[key] = typeof team[key] === 'number'
          ? 'some string'
          : 0;

        const res = await request
          .post('/')
          .set('Authorization', 'Bearer dummy_token')
          .send(team);

        expect(res.status).toBe(500);
        expect(res.body.errors.length).toBe(1);
        expect(createSpy).not.toHaveBeenCalled();
      });
      await Promise.all(attempts);
    });

    it('creates team when body is valid', async () => {
      const createSpy = jest.spyOn(teamService, 'createTeam');

      const res = await request
        .post('/')
        .set('Authorization', 'Bearer dummy_token')
        .send(teamDataA);

      expect(res.status).toBe(201);
      Object.keys(teamDataA).forEach((key) => {
        expect(res.body[key]).toBe(teamDataA[key]);
      });
      expect(createSpy).toHaveBeenCalled();
      createSpy.mockClear();

      validId = String(res.body.id);
    });
  });

  describe('GET /?...', () => {
    it('returns 404 when team not found', async () => {
      const getSpy = jest.spyOn(teamService, 'getTeams');

      const res = await request
        .get(`/?id=${invalidId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(404);
      expect(getSpy).rejects.toThrowError();
      getSpy.mockClear();
    });

    it('returns team if found', async () => {
      const getSpy = jest.spyOn(teamService, 'getTeams');

      const res = await request
        .get(`/?id=${validId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      Object.keys(teamDataA).forEach((key) => {
        expect(res.body[key]).toBe(teamDataA[key]);
      });
      expect(getSpy).toHaveBeenCalled();
      getSpy.mockClear();
    });

    it('returns team by userId', async () => {
      const getSpy = jest.spyOn(teamService, 'getTeams');

      const res = await request
        .get(`/?userId=${idUser}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      Object.keys(existingTeamData).forEach((key) => {
        expect(res.body[key]).toBe(existingTeamData[key]);
      });
      expect(getSpy).toHaveBeenCalled();
      getSpy.mockClear();
    });
  });

  describe('PATCH /:id', () => {
    it('requires valid permissions', async () => {
      const updateSpy = jest.spyOn(teamService, 'editTeams');

      const res = await request
        .patch(`/${validId}`)
        .send({ name: 'Cool Team A' });

      expect(res.status).toBe(403);
      expect(updateSpy).not.toHaveBeenCalled();
    });

    it('returns 404 if team not found', async () => {
      const updateSpy = jest.spyOn(teamService, 'editTeams');

      const res = await request
        .patch(`/${invalidId}`)
        .set('Authorization', 'Bearer dummy_token')
        .send({ name: 'Cool Team A' });

      expect(res.status).toBe(404);
      expect(updateSpy).rejects.toThrowError();
      updateSpy.mockClear();
    });

    it('blocks update when field invalid', async () => {
      const updateSpy = jest.spyOn(teamService, 'editTeams');

      const attempts = Object.keys(teamDataA).concat('otherkey').map(async (key) => {
        const teamUpdate = {
          [key]: typeof teamDataA[key] === 'number'
            ? 'some string'
            : 0,
        };

        const res = await request
          .patch(`/${validId}`)
          .set('Authorization', 'Bearer dummy_token')
          .send(teamUpdate);

        expect(res.status).toBe(400);
        expect(res.body.errors.length).toBe(1);
        expect(updateSpy).not.toHaveBeenCalled();
      });
      await Promise.all(attempts);
    });

    it('updates team when body is valid', async () => {
      const updateSpy = jest.spyOn(teamService, 'editTeams');

      const attempts = Object.keys(teamDataB).map(async (key) => {
        const teamUpdate = { [key]: teamDataB[key] };

        const res = await request
          .patch(`/${validId}`)
          .set('Authorization', 'Bearer dummy_token')
          .send(teamUpdate);

        expect(res.status).toBe(200);
        expect(res.body[key]).toBe(teamDataB[key]);
      });
      await Promise.all(attempts);

      expect(updateSpy).toHaveBeenCalledTimes(Object.keys(teamDataB).length);
      updateSpy.mockClear();

      const res = await request
        .get(`/?id=${validId}`)
        .set('Authorization', 'Bearer dummy_token');

      Object.keys(teamDataB).forEach((key) => {
        expect(res.body[key]).toBe(teamDataB[key]);
      });
    });
  });

  describe('DELETE /:id', () => {
    it('requires valid permissions', async () => {
      const deleteSpy = jest.spyOn(teamService, 'deleteTeams');

      const res = await request.delete(`/${validId}`);

      expect(res.status).toBe(403);
      expect(deleteSpy).not.toHaveBeenCalled();
    });

    it('returns 404 if team not found', async () => {
      const deleteSpy = jest.spyOn(teamService, 'deleteTeams');

      const res = await request
        .delete(`/${invalidId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(404);
      expect(deleteSpy).rejects.toThrowError();
      deleteSpy.mockClear();
    });

    it('deletes team', async () => {
      const deleteSpy = jest.spyOn(teamService, 'deleteTeams');

      const res = await request
        .delete(`/${validId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      expect(deleteSpy).toHaveBeenCalled();
      deleteSpy.mockClear();

      const getRes = await request
        .get(`/${validId}`)
        .set('Authorization', 'Bearer dummy_token');
      expect(getRes.status).toBe(404);
    });
  });
});