import supertest from 'supertest';
import cowCensusRouter from '../../routers/cow_census_router';
import { cowCensusService } from '../../services';
import db from '../../db/db';
import { ICowCensus } from '../../db/models/cow_census';

const request = supertest(cowCensusRouter);

const idHerd = '187dc38d-bc3a-4eb4-ac99-74e04de04d48'; // from seeder
const idPlot = '7c175ec1-6822-43d1-962e-8bed235100f6'; // from seeder
const idPhoto = null; // TODO: base64

const cowCensusDataA: Omit<ICowCensus, 'id'> = {
  herdId: idHerd,
  plotId: idPlot,
  photoId: idPhoto,
  bcs: [2, 3, 4],
  notes: 'Sphinx of black quartz, judge my vow.',
  tag: 'F123456',
};

const cowCensusDataB: Omit<ICowCensus, 'id'> = {
  herdId: idHerd,
  plotId: idPlot,
  photoId: idPhoto,
  bcs: [6, 7, 8],
  notes: 'Replacement entry',
  tag: 'F567890',
};

let validId = '';
const invalidId = '8a891ee5-28a7-4e5f-a205-8f8a0a171703';

// Mocks requireAuth server middleware
jest.mock('../../auth/requireAuth');
jest.mock('../../auth/requireScope');
jest.mock('../../auth/requireMembership');
jest.mock('../../auth/requireSelf');

describe('Working cowCensus router', () => {
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
      const createSpy = jest.spyOn(cowCensusService, 'createCowCensus');

      const res = await request
        .post('/')
        .send(cowCensusDataA);

      expect(res.status).toBe(403);
      expect(createSpy).not.toHaveBeenCalled();
    });

    it('creates cowCensus when body is valid', async () => {
      const createSpy = jest.spyOn(cowCensusService, 'createCowCensus');

      const res = await request
        .post('/')
        .set('Authorization', 'Bearer dummy_token')
        .send({
          herdId: cowCensusDataA.herdId,
          plotId: cowCensusDataA.plotId,
          // photo: null,
          bcs: cowCensusDataA.bcs,
          notes: cowCensusDataA.notes,
          tag: cowCensusDataA.tag,
        });

      expect(res.status).toBe(201);
      Object.keys(cowCensusDataA).forEach((key) => {
        if (key === 'bcs') {
          expect(res.body[key]).toEqual(cowCensusDataA[key]);
        } else expect(res.body[key]).toBe(cowCensusDataA[key]);
      });
      expect(createSpy).toHaveBeenCalled();
      createSpy.mockClear();

      validId = String(res.body.id);
    });
  });

  describe('GET /?...', () => {
    it('returns 404 when cowCensus not found', async () => {
      const getSpy = jest.spyOn(cowCensusService, 'getCowCensuses');

      const res = await request
        .get(`/?id=${invalidId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(404);
      expect(getSpy).rejects.toThrowError();
      getSpy.mockClear();
    });

    it('returns single cowCensus if found - generic', async () => {
      const getSpy = jest.spyOn(cowCensusService, 'getCowCensuses');

      const res = await request
        .get(`/?id=${validId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      Object.keys(cowCensusDataA).forEach((key) => {
        if (key === 'bcs') {
          expect(res.body[key]).toEqual(cowCensusDataA[key]);
        } else expect(res.body[key]).toBe(cowCensusDataA[key]);
      });
      expect(getSpy).toHaveBeenCalled();
      getSpy.mockClear();
    });

    it('returns single cowCensus if found - specific query', async () => {
      const getSpy = jest.spyOn(cowCensusService, 'getCowCensuses');

      const res = await request
        .get(`/?notes=${'Sphinx of black quartz, judge my vow.'}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      Object.keys(cowCensusDataA).forEach((key) => {
        if (key === 'bcs') {
          expect(res.body[key]).toEqual(cowCensusDataA[key]);
        } else expect(res.body[key]).toBe(cowCensusDataA[key]);
      });
      expect(getSpy).toHaveBeenCalled();
      getSpy.mockClear();
    });
  });

  describe('PATCH /:id', () => {
    it('requires valid permissions', async () => {
      const updateSpy = jest.spyOn(cowCensusService, 'editCowCensuses');

      const res = await request
        .patch(`/${validId}`)
        .send(cowCensusDataB);

      expect(res.status).toBe(403);
      expect(updateSpy).not.toHaveBeenCalled();
    });

    it('returns 404 if cowCensus not found', async () => {
      const updateSpy = jest.spyOn(cowCensusService, 'editCowCensuses');

      const res = await request
        .patch(`/${invalidId}`)
        .set('Authorization', 'Bearer dummy_token')
        .send({ ...cowCensusDataB, id: invalidId });

      expect(res.status).toBe(404);
      expect(updateSpy).rejects.toThrowError();
      updateSpy.mockClear();
    });

    it('updates cowCensus when body is valid', async () => {
      const updateSpy = jest.spyOn(cowCensusService, 'editCowCensuses');

      const attempts = Object.keys(cowCensusDataB).map(async (key) => {
        const cowCensusUpdate = { [key]: cowCensusDataB[key] };

        const res = await request
          .patch(`/${validId}`)
          .set('Authorization', 'Bearer dummy_token')
          .send(cowCensusUpdate);

        expect(res.status).toBe(200);
        if (key === 'bcs') {
          expect(res.body[key]).toEqual(cowCensusDataB[key]);
        } else expect(res.body[key]).toBe(cowCensusDataB[key]);
      });
      await Promise.all(attempts);

      expect(updateSpy).toHaveBeenCalledTimes(Object.keys(cowCensusDataB).length);
      updateSpy.mockClear();

      const res = await request
        .get(`/?id=${validId}`)
        .set('Authorization', 'Bearer dummy_token');

      Object.keys(cowCensusDataB).forEach((key) => {
        if (key === 'bcs') {
          expect(res.body[key]).toEqual(cowCensusDataB[key]);
        } else expect(res.body[key]).toBe(cowCensusDataB[key]);
      });
    });
  });

  describe('DELETE /:id', () => {
    it('requires valid permissions', async () => {
      const deleteSpy = jest.spyOn(cowCensusService, 'deleteCowCensuses');

      const res = await request.delete(`/${validId}`);

      expect(res.status).toBe(403);
      expect(deleteSpy).not.toHaveBeenCalled();
    });

    it('returns 404 if cowCensus not found', async () => {
      const deleteSpy = jest.spyOn(cowCensusService, 'deleteCowCensuses');

      const res = await request
        .delete(`/${invalidId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(404);
      expect(deleteSpy).rejects.toThrowError();
      deleteSpy.mockClear();
    });

    it('deletes cowCensus', async () => {
      const deleteSpy = jest.spyOn(cowCensusService, 'deleteCowCensuses');

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