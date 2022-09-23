import supertest from 'supertest';
import herdRouter from 'routers/herd_router';
import { herdService } from 'services';
import db from '../../db/db';
import { IHerd } from '../../db/models/herd';

const request = supertest(herdRouter);

const idTeam = '6aab56d3-ac8c-4f3b-a59b-c03e51c76e5d'; // from seeder

const herdDataA: Omit<IHerd, 'id'> = {
  teamId: idTeam,
  species: 'Holstein Friesian',
  count: 10,
  breedingDate: new Date('2022-04-21 21:50:56.305-04'),
  calvingDate: new Date('2022-08-21 21:50:56.305-04'),
};

const herdDataB: Omit<IHerd, 'id'> = {
  teamId: idTeam,
  species: 'Swiss Fleckvieh',
  count: 12,
  breedingDate: new Date('2022-05-21 21:50:56.305-04'),
  calvingDate: new Date('2022-09-21 21:50:56.305-04'),
};

let validId = '';
const invalidId = '048348e1-24ac-4d74-bb10-4e07e98a4d0b';

// Mocks requireAuth server middleware
jest.mock('../../auth/requireAuth');
jest.mock('../../auth/requireScope');
jest.mock('../../auth/requireMembership');
jest.mock('../../auth/requireSelf');

describe('Working herd router', () => {
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
      const createSpy = jest.spyOn(herdService, 'createHerd');

      const res = await request
        .post('/')
        .send(herdDataA);

      expect(res.status).toBe(403);
      expect(createSpy).not.toHaveBeenCalled();
    });

    it('blocks creation when missing field', async () => {
      const createSpy = jest.spyOn(herdService, 'createHerd');

      const attempts = Object.keys(herdDataA).map(async (key) => {
        const herd = { ...herdDataA };
        delete herd[key];

        const res = await request
          .post('/')
          .set('Authorization', 'Bearer dummy_token')
          .send(herd);

        expect(res.status).toBe(500);
        expect(res.body.errors.length).toBe(1);
        expect(createSpy).not.toHaveBeenCalled();
      });
      await Promise.all(attempts);
    });

    it('blocks creation when field invalid', async () => {
      const createSpy = jest.spyOn(herdService, 'createHerd');

      const attempts = Object.keys(herdDataA).map(async (key) => {
        const herd = { ...herdDataA };
        if (typeof herd[key] === 'number') {
          herd[key] = 'some string';
        } else if (typeof herd[key] === 'object') {
          herd[key] = undefined;
        } else {
          herd[key] = 0;
        }

        const res = await request
          .post('/')
          .set('Authorization', 'Bearer dummy_token')
          .send(herd);

        expect(res.status).toBe(500);
        expect(res.body.errors.length).toBe(1);
        expect(createSpy).not.toHaveBeenCalled();
      });
      await Promise.all(attempts);
    });

    it('creates herd when body is valid', async () => {
      const createSpy = jest.spyOn(herdService, 'createHerd');

      const res = await request
        .post('/')
        .set('Authorization', 'Bearer dummy_token')
        .send(herdDataA);

      expect(res.status).toBe(201);
      Object.keys(herdDataA).forEach((key) => {
        if (key === 'breedingDate' || key === 'calvingDate') {
          expect(new Date(res.body[key])).toEqual(herdDataA[key]);
        } else expect(res.body[key]).toBe(herdDataA[key]);
      });
      expect(createSpy).toHaveBeenCalled();
      createSpy.mockClear();

      validId = String(res.body.id);
    });
  });

  describe('GET /:id', () => {
    it('returns 404 when herd not found', async () => {
      const getSpy = jest.spyOn(herdService, 'getHerds');

      const res = await request
        .get(`/${invalidId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(404);
      expect(getSpy).rejects.toThrowError();
      getSpy.mockClear();
    });

    it('returns herd if found', async () => {
      const getSpy = jest.spyOn(herdService, 'getHerds');

      const res = await request
        .get(`/${validId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      Object.keys(herdDataA).forEach((key) => {
        if (key === 'breedingDate' || key === 'calvingDate') {
          expect(new Date(res.body[key])).toEqual(herdDataA[key]);
        } else expect(res.body[key]).toBe(herdDataA[key]);
      });
      expect(getSpy).toHaveBeenCalled();
      getSpy.mockClear();
    });
  });

  describe('PATCH /:id', () => {
    it('requires valid permissions', async () => {
      const updateSpy = jest.spyOn(herdService, 'editHerds');

      const res = await request
        .patch(`/${validId}`)
        .send(herdDataB);

      expect(res.status).toBe(403);
      expect(updateSpy).not.toHaveBeenCalled();
    });

    it('returns 404 if herd not found', async () => {
      const updateSpy = jest.spyOn(herdService, 'editHerds');

      const res = await request
        .patch(`/${invalidId}`)
        .set('Authorization', 'Bearer dummy_token')
        .send({ ...herdDataB, id: invalidId });

      expect(res.status).toBe(404);
      expect(updateSpy).rejects.toThrowError();
      updateSpy.mockClear();
    });

    it('blocks update when field invalid', async () => {
      const updateSpy = jest.spyOn(herdService, 'editHerds');

      const attempts = Object.keys(herdDataA).concat('otherkey').map(async (key) => {
        
        const herdUpdate = {
          id: validId,
        }; 
        if (key === 'breedingDate' || key === 'calvingDate') {
          herdUpdate[key] = 'not a date';
        } else if (typeof herdDataB[key] === 'number') {
          herdUpdate[key] = 'some string';
        } else {
          herdUpdate[key] = 0;
        }
        
        const res = await request
          .patch(`/${validId}`)
          .set('Authorization', 'Bearer dummy_token')
          .send(herdUpdate);
        // console.log(res);

        expect(res.status).toBe(400);
        expect(res.body.errors.length).toBe(1);
        expect(updateSpy).not.toHaveBeenCalled();
      });
      await Promise.all(attempts);
    });

    it('updates herd when body is valid', async () => {
      const updateSpy = jest.spyOn(herdService, 'editHerds');

      const attempts = Object.keys(herdDataB).map(async (key) => {
        const herdUpdate = { [key]: herdDataB[key] };

        const res = await request
          .patch(`/${validId}`)
          .set('Authorization', 'Bearer dummy_token')
          .send(herdUpdate);

        expect(res.status).toBe(200);
        if (key === 'breedingDate' || key === 'calvingDate') {
          expect(new Date(res.body[key])).toEqual(herdDataB[key]);
        } else expect(res.body[key]).toBe(herdDataB[key]);
      });
      await Promise.all(attempts);

      expect(updateSpy).toHaveBeenCalledTimes(Object.keys(herdDataB).length);
      updateSpy.mockClear();

      const res = await request
        .get(`/${validId}`)
        .set('Authorization', 'Bearer dummy_token');

      Object.keys(herdDataB).forEach((key) => {
        if (key === 'breedingDate' || key === 'calvingDate') {
          expect(new Date(res.body[key])).toEqual(herdDataB[key]);
        } else expect(res.body[key]).toBe(herdDataB[key]);
      });
    });
  });

  describe('DELETE /:id', () => {
    it('requires valid permissions', async () => {
      const deleteSpy = jest.spyOn(herdService, 'deleteHerds');

      const res = await request.delete(`/${validId}`);

      expect(res.status).toBe(403);
      expect(deleteSpy).not.toHaveBeenCalled();
    });

    it('returns 404 if herd not found', async () => {
      const deleteSpy = jest.spyOn(herdService, 'deleteHerds');

      const res = await request
        .delete(`/${invalidId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(404);
      expect(deleteSpy).rejects.toThrowError();
      deleteSpy.mockClear();
    });

    it('deletes herd', async () => {
      const deleteSpy = jest.spyOn(herdService, 'deleteHerds');

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