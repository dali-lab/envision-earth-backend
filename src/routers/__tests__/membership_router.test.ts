import supertest from 'supertest';
import membershipRouter from 'routers/membership_router';
import { membershipService } from 'services';
import db from '../../db/db';
import { IMembership } from '../../db/models/membership';
import { TeamScopes } from 'db/models/team';

const request = supertest(membershipRouter);

const idTeam = '6aab56d3-ac8c-4f3b-a59b-c03e51c76e5d'; // from seeder
const idUser = '68b0d858-9e75-49b0-902e-2b587bd9a996'; // from seeder

const membershipDataA: Omit<IMembership, 'id' | 'role'> = {
  teamId: idTeam,
  userId: idUser,
};

const membershipDataB: Omit<IMembership, 'id' | 'role'> = {
  teamId: idTeam,
  userId: idUser,
};

let validId = '';
const invalidId = 'e6482833-2b7e-4306-9387-c5467864d93d';

// Mocks requireAuth server middleware
jest.mock('../../auth/requireAuth');
jest.mock('../../auth/requireScope');
jest.mock('../../auth/requireMembership');
jest.mock('../../auth/requireSelf');

describe('Working membership router', () => {
  beforeAll(async () => {
    try {
      await db.authenticate();
      await db.sync();
    } catch (error) {
      throw new Error('Unable to connect to database...');
    }
  });

  describe('POST /', () => {
    /*
    it('requires valid permissions', async () => {
      const createSpy = jest.spyOn(membershipService, 'createMembership');

      const res = await request
        .post('/')
        .send(membershipDataA);

      expect(res.status).toBe(403);
      expect(createSpy).not.toHaveBeenCalled();
    });

    it('blocks creation when missing field', async () => {
      const createSpy = jest.spyOn(membershipService, 'createMembership');

      const attempts = Object.keys(membershipDataA).map(async (key) => {
        const membership = { ...membershipDataA };
        delete membership[key];

        const res = await request
          .post('/')
          .set('Authorization', 'Bearer dummy_token')
          .send(membership);

        expect(res.status).toBe(500);
        expect(res.body.errors.length).toBe(1);
        expect(createSpy).not.toHaveBeenCalled();
      });
      await Promise.all(attempts);
    });

    it('blocks creation when field invalid', async () => {
      const createSpy = jest.spyOn(membershipService, 'createMembership');

      const attempts = Object.keys(membershipDataA).map(async (key) => {
        const membership = { ...membershipDataA };
        membership[key] = typeof membership[key] === 'number'
          ? 'some string'
          : 0;
f
        const res = await request
          .post('/')
          .set('Authorization', 'Bearer dummy_token')
          .send(membership);

        expect(res.status).toBe(500);
        expect(res.body.errors.length).toBe(1);
        expect(createSpy).not.toHaveBeenCalled();
      });
      await Promise.all(attempts);
    });
    */

    it('creates membership when body is valid', async () => {
      const createSpy = jest.spyOn(membershipService, 'createMembership');

      const res = await request
        .post('/')
        .set('Authorization', 'Bearer dummy_token')
        .send(membershipDataA);

      expect(res.status).toBe(201);
      Object.keys(membershipDataA).forEach((key) => {
        expect(res.body[key]).toBe(membershipDataA[key]);
      });
      expect(createSpy).toHaveBeenCalled();
      createSpy.mockClear();

      validId = String(res.body.id);
    });
  });

  describe('GET /:id', () => {
    it('returns 404 when membership not found', async () => {
      const getSpy = jest.spyOn(membershipService, 'getMemberships');

      const res = await request
        .get(`/${invalidId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(404);
      expect(getSpy).rejects.toThrowError();
      getSpy.mockClear();
    });

    it('returns membership if found', async () => {
      const getSpy = jest.spyOn(membershipService, 'getMemberships');

      const res = await request
        .get(`/${validId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      Object.keys(membershipDataA).forEach((key) => {
        expect(res.body[key]).toBe(membershipDataA[key]);
      });
      expect(getSpy).toHaveBeenCalled();
      getSpy.mockClear();
    });
  });

  describe('PATCH /:id', () => {
    it('requires valid permissions', async () => {
      const updateSpy = jest.spyOn(membershipService, 'editMemberships');

      const res = await request
        .patch(`/${validId}`)
        .send({ teamId: membershipDataB.teamId, userId: membershipDataB.teamId });

      expect(res.status).toBe(403);
      expect(updateSpy).not.toHaveBeenCalled();
    });

    it('returns 404 if membership not found', async () => {
      const updateSpy = jest.spyOn(membershipService, 'editMemberships');

      const res = await request
        .patch(`/${invalidId}`)
        .set('Authorization', 'Bearer dummy_token')
        .send({ id: invalidId, teamId: membershipDataB.teamId, userId: membershipDataB.teamId, role: TeamScopes.Contributor });

      expect(res.status).toBe(404);
      expect(updateSpy).rejects.toThrowError();
      updateSpy.mockClear();
    });

    it('blocks creation when field invalid', async () => {
      const updateSpy = jest.spyOn(membershipService, 'editMemberships');

      const attempts = Object.keys(membershipDataA).concat('otherkey').map(async (key) => {
        const membershipUpdate = {
          [key]: typeof membershipDataA[key] === 'number'
            ? 'some string'
            : 0,
        };

        const res = await request
          .patch(`/${validId}`)
          .set('Authorization', 'Bearer dummy_token')
          .send(membershipUpdate);

        expect(res.status).toBe(400);
        expect(res.body.errors.length).toBe(1);
        expect(updateSpy).not.toHaveBeenCalled();
      });
      await Promise.all(attempts);
    });

    it('updates membership when body is valid', async () => {
      const updateSpy = jest.spyOn(membershipService, 'editMemberships');

      const attempts = Object.keys(membershipDataB).map(async (key) => {
        const membershipUpdate = { [key]: membershipDataB[key] };

        const res = await request
          .patch(`/${validId}`)
          .set('Authorization', 'Bearer dummy_token')
          .send(membershipUpdate);

        expect(res.status).toBe(200);
        expect(res.body[key]).toBe(membershipDataB[key]);
      });
      await Promise.all(attempts);

      expect(updateSpy).toHaveBeenCalledTimes(Object.keys(membershipDataB).length);
      updateSpy.mockClear();

      const res = await request
        .get(`/${validId}`)
        .set('Authorization', 'Bearer dummy_token');

      Object.keys(membershipDataB).forEach((key) => {
        expect(res.body[key]).toBe(membershipDataB[key]);
      });
    });
  });

  describe('DELETE /:id', () => {
    it('requires valid permissions', async () => {
      const deleteSpy = jest.spyOn(membershipService, 'deleteMemberships');

      const res = await request.delete(`/${validId}`);

      expect(res.status).toBe(403);
      expect(deleteSpy).not.toHaveBeenCalled();
    });

    it('returns 404 if membership not found', async () => {
      const deleteSpy = jest.spyOn(membershipService, 'deleteMemberships');

      const res = await request
        .delete(`/${invalidId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(404);
      expect(deleteSpy).rejects.toThrowError();
      deleteSpy.mockClear();
    });

    it('deletes membership', async () => {
      const deleteSpy = jest.spyOn(membershipService, 'deleteMemberships');

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