import supertest from 'supertest';
import dungCensusRouter from '../../routers/dung_census_router';
import { dungCensusService } from '../../services';
import db from '../../db/db';
import { IDungCensus } from '../../db/models/dung_census';

const request = supertest(dungCensusRouter);

const idHerd = '187dc38d-bc3a-4eb4-ac99-74e04de04d48'; // from seeder
const idPlot = '7c175ec1-6822-43d1-962e-8bed235100f6'; // from seeder
const idPhoto = null; // TODO: base64

const dungCensusDataA: Omit<IDungCensus, 'id'> = {
  herdId: idHerd,
  plotId: idPlot,
  photoId: idPhoto,
  ratings: [0.65, -0.15, 0.03],
  notes: 'Waltz, bad nymph, for quick jigs vex.',
};

const dungCensusDataB: Omit<IDungCensus, 'id'> = {
  herdId: idHerd,
  plotId: idPlot,
  photoId: idPhoto,
  ratings: [0.65, -0.15, 0.03, 0.05],
  notes: 'How vexingly quick daft zebras jump!',
};

let validId = '';
const invalidId = '60955e2e-7977-4ddc-b689-15527b797a74';

// Mocks requireAuth server middleware
jest.mock('../../auth/requireAuth');
jest.mock('../../auth/requireScope');
jest.mock('../../auth/requireMembership');
jest.mock('../../auth/requireSelf');

describe('Working dungCensus router', () => {
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
      const createSpy = jest.spyOn(dungCensusService, 'createDungCensus');

      const res = await request
        .post('/')
        .send(dungCensusDataA);

      expect(res.status).toBe(403);
      expect(createSpy).not.toHaveBeenCalled();
    });

    it('creates dungCensus when body is valid', async () => {
      const createSpy = jest.spyOn(dungCensusService, 'createDungCensus');

      const res = await request
        .post('/')
        .set('Authorization', 'Bearer dummy_token')
        .send({
          herdId: dungCensusDataA.herdId,
          plotId: dungCensusDataA.plotId,
          // photo: null,
          ratings: dungCensusDataA.ratings,
          notes: dungCensusDataA.notes,
        });

      expect(res.status).toBe(201);
      Object.keys(dungCensusDataA).forEach((key) => {
        if (key === 'ratings') {
          expect(res.body[key]).toEqual(dungCensusDataA[key]);
        } else expect(res.body[key]).toBe(dungCensusDataA[key]);
      });
      expect(createSpy).toHaveBeenCalled();
      createSpy.mockClear();

      validId = String(res.body.id);
    });
  });

  describe('GET /?...', () => {
    it('returns 404 when dungCensus not found', async () => {
      const getSpy = jest.spyOn(dungCensusService, 'getDungCensuses');

      const res = await request
        .get(`/?id=${invalidId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(404);
      expect(getSpy).rejects.toThrowError();
      getSpy.mockClear();
    });

    it('returns single dungCensus if found - generic', async () => {
      const getSpy = jest.spyOn(dungCensusService, 'getDungCensuses');

      const res = await request
        .get(`/?id=${validId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      Object.keys(dungCensusDataA).forEach((key) => {
        if (key === 'ratings') {
          expect(res.body[key]).toEqual(dungCensusDataA[key]);
        } else expect(res.body[key]).toBe(dungCensusDataA[key]);
      });
      expect(getSpy).toHaveBeenCalled();
      getSpy.mockClear();
    });

    it('returns single dungCensus if found - specific query', async () => {
      const getSpy = jest.spyOn(dungCensusService, 'getDungCensuses');

      const res = await request
        .get(`/?notes=${'Waltz, bad nymph, for quick jigs vex.'}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      Object.keys(dungCensusDataA).forEach((key) => {
        if (key === 'ratings') {
          expect(res.body[key]).toEqual(dungCensusDataA[key]);
        } else expect(res.body[key]).toBe(dungCensusDataA[key]);
      });
      expect(getSpy).toHaveBeenCalled();
      getSpy.mockClear();
    });
  });

  describe('PATCH /:id', () => {
    it('requires valid permissions', async () => {
      const updateSpy = jest.spyOn(dungCensusService, 'editDungCensuses');

      const res = await request
        .patch(`/${validId}`)
        .send(dungCensusDataB);

      expect(res.status).toBe(403);
      expect(updateSpy).not.toHaveBeenCalled();
    });

    it('returns 404 if dungCensus not found', async () => {
      const updateSpy = jest.spyOn(dungCensusService, 'editDungCensuses');

      const res = await request
        .patch(`/${invalidId}`)
        .set('Authorization', 'Bearer dummy_token')
        .send({ ...dungCensusDataB, id: invalidId });

      expect(res.status).toBe(404);
      expect(updateSpy).rejects.toThrowError();
      updateSpy.mockClear();
    });

    it('updates dungCensus when body is valid', async () => {
      const updateSpy = jest.spyOn(dungCensusService, 'editDungCensuses');

      const attempts = Object.keys(dungCensusDataB).map(async (key) => {
        const dungCensusUpdate = { [key]: dungCensusDataB[key] };

        const res = await request
          .patch(`/${validId}`)
          .set('Authorization', 'Bearer dummy_token')
          .send(dungCensusUpdate);

        expect(res.status).toBe(200);
        if (key === 'ratings') {
          expect(res.body[key]).toEqual(dungCensusDataB[key]);
        } else expect(res.body[key]).toBe(dungCensusDataB[key]);
      });
      await Promise.all(attempts);

      expect(updateSpy).toHaveBeenCalledTimes(Object.keys(dungCensusDataB).length);
      updateSpy.mockClear();

      const res = await request
        .get(`/?id=${validId}`)
        .set('Authorization', 'Bearer dummy_token');

      Object.keys(dungCensusDataB).forEach((key) => {
        if (key === 'ratings') {
          expect(res.body[key]).toEqual(dungCensusDataB[key]);
        } else expect(res.body[key]).toBe(dungCensusDataB[key]);
      });
    });
  });

  describe('DELETE /:id', () => {
    it('requires valid permissions', async () => {
      const deleteSpy = jest.spyOn(dungCensusService, 'deleteDungCensuses');

      const res = await request.delete(`/${validId}`);

      expect(res.status).toBe(403);
      expect(deleteSpy).not.toHaveBeenCalled();
    });

    it('returns 404 if dungCensus not found', async () => {
      const deleteSpy = jest.spyOn(dungCensusService, 'deleteDungCensuses');

      const res = await request
        .delete(`/${invalidId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(404);
      expect(deleteSpy).rejects.toThrowError();
      deleteSpy.mockClear();
    });

    it('deletes dungCensus', async () => {
      const deleteSpy = jest.spyOn(dungCensusService, 'deleteDungCensuses');

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