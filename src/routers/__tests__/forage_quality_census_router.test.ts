import supertest from 'supertest';
import forageQualityCensusRouter from '../../routers/forage_quality_census_router';
import { forageQualityCensusService } from '../../services';
import db from '../../db/db';
import { IForageQualityCensus } from '../../db/models/forage_quality_census';

const request = supertest(forageQualityCensusRouter);

const idPlot = '7c175ec1-6822-43d1-962e-8bed235100f6'; // from seeder
const idPhoto = null; // TODO: base64

const forageQualityCensusDataA: Omit<IForageQualityCensus, 'id'> = {
  plotId: idPlot,
  photoId: idPhoto,
  rating: 8,
  notes: 'Jackdaws love my big sphinx of quartz.',
};

const forageQualityCensusDataB: Omit<IForageQualityCensus, 'id'> = {
  plotId: idPlot,
  photoId: idPhoto,
  rating: 8,
  notes: 'The five boxing wizards jump quickly.',
};

let validId = '';
const invalidId = 'cfe54019-065b-456c-9ef3-187ca27f9e23';

// Mocks requireAuth server middleware
jest.mock('../../auth/requireAuth');
jest.mock('../../auth/requireScope');
jest.mock('../../auth/requireMembership');
jest.mock('../../auth/requireSelf');

describe('Working forageQualityCensus router', () => {
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
      const createSpy = jest.spyOn(forageQualityCensusService, 'createForageQualityCensus');

      const res = await request
        .post('/')
        .send({
          plotId: forageQualityCensusDataA.plotId,
          // photo: null,
          rating: forageQualityCensusDataA.rating,
          notes: forageQualityCensusDataA.notes,
        });

      expect(res.status).toBe(403);
      expect(createSpy).not.toHaveBeenCalled();
    });

    it('creates forageQualityCensus when body is valid', async () => {
      const createSpy = jest.spyOn(forageQualityCensusService, 'createForageQualityCensus');

      const res = await request
        .post('/')
        .set('Authorization', 'Bearer dummy_token')
        .send({
          plotId: forageQualityCensusDataA.plotId,
          // photo: null,
          rating: forageQualityCensusDataA.rating,
          notes: forageQualityCensusDataA.notes,
        });

      expect(res.status).toBe(201);
      Object.keys(forageQualityCensusDataA).forEach((key) => {
        expect(res.body[key]).toBe(forageQualityCensusDataA[key]);
      });
      expect(createSpy).toHaveBeenCalled();
      createSpy.mockClear();

      validId = String(res.body.id);
    });
  });

  describe('GET /?...=...', () => {
    it('returns empty array if no forageQualityCensuses found', async () => {
      const getSpy = jest.spyOn(forageQualityCensusService, 'getForageQualityCensuses');

      const res = await request
        .get(`/?id=${invalidId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
      getSpy.mockClear();
    });

    it('returns forageQualityCensuses by query', async () => {
      const getSpy = jest.spyOn(forageQualityCensusService, 'getForageQualityCensuses');

      const res = await request
        .get(`/?notes=${forageQualityCensusDataA.notes}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);

      Object.keys(forageQualityCensusDataA).forEach((key) => {
        expect(res.body[key]).toBe(forageQualityCensusDataA[key]);
      });
      expect(getSpy).toHaveBeenCalled();
      getSpy.mockClear();
    });
  });

  describe('GET /:id?...=...', () => {
    it('returns 404 when forageQualityCensus not found', async () => {
      const getSpy = jest.spyOn(forageQualityCensusService, 'getForageQualityCensuses');

      const res = await request
        .get(`/${invalidId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(404);
      expect(getSpy).rejects.toThrowError();
      getSpy.mockClear();
    });

    it('returns single forageQualityCensus if found - generic', async () => {
      const getSpy = jest.spyOn(forageQualityCensusService, 'getForageQualityCensuses');

      const res = await request
        .get(`/${validId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      Object.keys(forageQualityCensusDataA).forEach((key) => {
        expect(res.body[key]).toBe(forageQualityCensusDataA[key]);
      });
      expect(getSpy).toHaveBeenCalled();
      getSpy.mockClear();
    });

    it('returns single forageQualityCensus if found - specific query', async () => {
      const getSpy = jest.spyOn(forageQualityCensusService, 'getForageQualityCensuses');

      const res = await request
        .get(`/${validId}?notes=${forageQualityCensusDataA.notes}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      Object.keys(forageQualityCensusDataA).forEach((key) => {
        expect(res.body[key]).toBe(forageQualityCensusDataA[key]);
      });
      expect(getSpy).toHaveBeenCalled();
      getSpy.mockClear();
    });
  });

  describe('PATCH /:id', () => {
    it('requires valid permissions', async () => {
      const updateSpy = jest.spyOn(forageQualityCensusService, 'editForageQualityCensuses');

      const res = await request
        .patch(`/${validId}`)
        .send(forageQualityCensusDataB);

      expect(res.status).toBe(403);
      expect(updateSpy).not.toHaveBeenCalled();
    });

    it('returns 404 if forageQualityCensus not found', async () => {
      const updateSpy = jest.spyOn(forageQualityCensusService, 'editForageQualityCensuses');

      const res = await request
        .patch(`/${invalidId}`)
        .set('Authorization', 'Bearer dummy_token')
        .send({ ...forageQualityCensusDataB, id: invalidId });

      expect(res.status).toBe(404);
      expect(updateSpy).rejects.toThrowError();
      updateSpy.mockClear();
    });

    it('updates forageQualityCensus when body is valid', async () => {
      const updateSpy = jest.spyOn(forageQualityCensusService, 'editForageQualityCensuses');

      const attempts = Object.keys(forageQualityCensusDataB).map(async (key) => {
        const forageQualityCensusUpdate = { [key]: forageQualityCensusDataB[key] };

        const res = await request
          .patch(`/${validId}`)
          .set('Authorization', 'Bearer dummy_token')
          .send(forageQualityCensusUpdate);

        expect(res.status).toBe(200);
        expect(res.body[key]).toBe(forageQualityCensusDataB[key]);
      });
      await Promise.all(attempts);

      expect(updateSpy).toHaveBeenCalledTimes(Object.keys(forageQualityCensusDataB).length);
      updateSpy.mockClear();

      const res = await request
        .get(`/${validId}`)
        .set('Authorization', 'Bearer dummy_token');

      Object.keys(forageQualityCensusDataB).forEach((key) => {
        expect(res.body[key]).toBe(forageQualityCensusDataB[key]);
      });
    });
  });

  describe('DELETE /:id', () => {
    it('requires valid permissions', async () => {
      const deleteSpy = jest.spyOn(forageQualityCensusService, 'deleteForageQualityCensuses');

      const res = await request.delete(`/${validId}`);

      expect(res.status).toBe(403);
      expect(deleteSpy).not.toHaveBeenCalled();
    });

    it('returns 404 if forageQualityCensus not found', async () => {
      const deleteSpy = jest.spyOn(forageQualityCensusService, 'deleteForageQualityCensuses');

      const res = await request
        .delete(`/${invalidId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(404);
      expect(deleteSpy).rejects.toThrowError();
      deleteSpy.mockClear();
    });

    it('deletes forageQualityCensus', async () => {
      const deleteSpy = jest.spyOn(forageQualityCensusService, 'deleteForageQualityCensuses');

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