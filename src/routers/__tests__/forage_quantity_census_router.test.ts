import supertest from 'supertest';
import forageQuantityCensusRouter from '../../routers/forage_quantity_census_router';
import { forageQuantityCensusService } from '../../services';
import db from '../../db/db';
import { IForageQuantityCensus } from '../../db/models/forage_quantity_census';

const request = supertest(forageQuantityCensusRouter);

const idPlot = '7c175ec1-6822-43d1-962e-8bed235100f6'; // from seeder
const idPhoto = null; // TODO: base64

const forageQuantityCensusDataA: Omit<IForageQuantityCensus, 'id'> = {
  plotId: idPlot,
  photoId: idPhoto,
  sda: 8,
  notes: 'Forage Quantity A',
};

const forageQuantityCensusDataB: Omit<IForageQuantityCensus, 'id'> = {
  plotId: idPlot,
  photoId: idPhoto,
  sda: 8,
  notes: 'Forage Quantity B',
};

let validId = '';
const invalidId = 'cfe54019-065b-456c-9ef3-187ca27f9e23';

// Mocks requireAuth server middleware
jest.mock('../../auth/requireAuth');
jest.mock('../../auth/requireScope');
jest.mock('../../auth/requireMembership');
jest.mock('../../auth/requireSelf');

describe('Working forageQuantityCensus router', () => {
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
      const createSpy = jest.spyOn(forageQuantityCensusService, 'createForageQuantityCensus');

      const res = await request
        .post('/')
        .send({
          plotId: forageQuantityCensusDataA.plotId,
          // photo: null,
          sda: forageQuantityCensusDataA.sda,
          notes: forageQuantityCensusDataA.notes,
        });

      expect(res.status).toBe(403);
      expect(createSpy).not.toHaveBeenCalled();
    });

    it('creates forageQuantityCensus when body is valid', async () => {
      const createSpy = jest.spyOn(forageQuantityCensusService, 'createForageQuantityCensus');

      const res = await request
        .post('/')
        .set('Authorization', 'Bearer dummy_token')
        .send({
          plotId: forageQuantityCensusDataA.plotId,
          // photo: null,
          sda: forageQuantityCensusDataA.sda,
          notes: forageQuantityCensusDataA.notes,
        });

      expect(res.status).toBe(201);
      Object.keys(forageQuantityCensusDataA).forEach((key) => {
        expect(res.body[key]).toBe(forageQuantityCensusDataA[key]);
      });
      expect(createSpy).toHaveBeenCalled();
      createSpy.mockClear();

      validId = String(res.body.id);
    });
  });

  describe('GET /?...=...', () => {
    it('returns empty array if no forageQuantityCensuses found', async () => {
      const getSpy = jest.spyOn(forageQuantityCensusService, 'getForageQuantityCensuses');

      const res = await request
        .get(`/?id=${invalidId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
      getSpy.mockClear();
    });

    it('returns forageQuantityCensuses by query', async () => {
      const getSpy = jest.spyOn(forageQuantityCensusService, 'getForageQuantityCensuses');

      const res = await request
        .get(`/?notes=${forageQuantityCensusDataA.notes}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      // TODO: Error with plotId

      Object.keys(forageQuantityCensusDataA).forEach((key) => {
        expect(res.body[key]).toBe(forageQuantityCensusDataA[key]);
      });
      expect(getSpy).toHaveBeenCalled();
      getSpy.mockClear();
    });
  });

  describe('GET /:id?...=...', () => {
    it('returns 404 when forageQuantityCensus not found', async () => {
      const getSpy = jest.spyOn(forageQuantityCensusService, 'getForageQuantityCensuses');

      const res = await request
        .get(`/${invalidId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(404);
      expect(getSpy).rejects.toThrowError();
      getSpy.mockClear();
    });

    it('returns single forageQuantityCensus if found - generic', async () => {
      const getSpy = jest.spyOn(forageQuantityCensusService, 'getForageQuantityCensuses');

      const res = await request
        .get(`/${validId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      Object.keys(forageQuantityCensusDataA).forEach((key) => {
        expect(res.body[key]).toBe(forageQuantityCensusDataA[key]);
      });
      expect(getSpy).toHaveBeenCalled();
      getSpy.mockClear();
    });

    it('returns single forageQuantityCensus if found - specific query', async () => {
      const getSpy = jest.spyOn(forageQuantityCensusService, 'getForageQuantityCensuses');

      const res = await request
        .get(`/${validId}?notes=${forageQuantityCensusDataA.notes}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      Object.keys(forageQuantityCensusDataA).forEach((key) => {
        expect(res.body[key]).toBe(forageQuantityCensusDataA[key]);
      });
      expect(getSpy).toHaveBeenCalled();
      getSpy.mockClear();
    });
  });

  describe('PATCH /:id', () => {
    it('requires valid permissions', async () => {
      const updateSpy = jest.spyOn(forageQuantityCensusService, 'editForageQuantityCensuses');

      const res = await request
        .patch(`/${validId}`)
        .send(forageQuantityCensusDataB);

      expect(res.status).toBe(403);
      expect(updateSpy).not.toHaveBeenCalled();
    });

    it('returns 404 if forageQuantityCensus not found', async () => {
      const updateSpy = jest.spyOn(forageQuantityCensusService, 'editForageQuantityCensuses');

      const res = await request
        .patch(`/${invalidId}`)
        .set('Authorization', 'Bearer dummy_token')
        .send({ ...forageQuantityCensusDataB, id: invalidId });

      expect(res.status).toBe(404);
      expect(updateSpy).rejects.toThrowError();
      updateSpy.mockClear();
    });

    it('updates forageQuantityCensus when body is valid', async () => {
      const updateSpy = jest.spyOn(forageQuantityCensusService, 'editForageQuantityCensuses');

      const attempts = Object.keys(forageQuantityCensusDataB).map(async (key) => {
        const forageQuantityCensusUpdate = { [key]: forageQuantityCensusDataB[key] };

        const res = await request
          .patch(`/${validId}`)
          .set('Authorization', 'Bearer dummy_token')
          .send(forageQuantityCensusUpdate);

        expect(res.status).toBe(200);
        expect(res.body[key]).toBe(forageQuantityCensusDataB[key]);
      });
      await Promise.all(attempts);

      expect(updateSpy).toHaveBeenCalledTimes(Object.keys(forageQuantityCensusDataB).length);
      updateSpy.mockClear();

      const res = await request
        .get(`/${validId}`)
        .set('Authorization', 'Bearer dummy_token');

      Object.keys(forageQuantityCensusDataB).forEach((key) => {
        expect(res.body[key]).toBe(forageQuantityCensusDataB[key]);
      });
    });
  });

  describe('DELETE /:id', () => {
    it('requires valid permissions', async () => {
      const deleteSpy = jest.spyOn(forageQuantityCensusService, 'deleteForageQuantityCensuses');

      const res = await request.delete(`/${validId}`);

      expect(res.status).toBe(403);
      expect(deleteSpy).not.toHaveBeenCalled();
    });

    it('returns 404 if forageQuantityCensus not found', async () => {
      const deleteSpy = jest.spyOn(forageQuantityCensusService, 'deleteForageQuantityCensuses');

      const res = await request
        .delete(`/${invalidId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(404);
      expect(deleteSpy).rejects.toThrowError();
      deleteSpy.mockClear();
    });

    it('deletes forageQuantityCensus', async () => {
      const deleteSpy = jest.spyOn(forageQuantityCensusService, 'deleteForageQuantityCensuses');

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