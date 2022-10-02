import supertest from 'supertest';
import cowCensusRouter from '../../routers/cow_census_router';
import { cowCensusService } from '../../services';
import db from '../../db/db';
import { ICowCensus } from '../../db/models/cow_census';

const request = supertest(cowCensusRouter);

const idHerd = '187dc38d-bc3a-4eb4-ac99-74e04de04d48'; // from seeder
const idPhoto = 'ef57a439-4dad-4010-86cd-b2f9d58183bb'; // from seeder

const cowCensusDataA: Omit<ICowCensus, 'id'> = {
  herdId: idHerd,
  photoId: idPhoto,
  bcs: 3,
  notes: 'Waltz, bad nymph, for quick jigs vex.',
  tag: 'F123456',
};

const cowCensusDataB: Omit<ICowCensus, 'id'> = {
  herdId: idHerd,
  photoId: idPhoto,
  bcs: 9,
  notes: 'How vexingly quick daft zebras jump!',
  tag: 'F567890',
};

let validId = '';
const invalidId = 'a70945f7-b6ab-40f0-916b-e3fdf36388b8';

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

    it('blocks creation when missing field', async () => {
      const createSpy = jest.spyOn(cowCensusService, 'createCowCensus');

      const attempts = Object.keys(cowCensusDataA).map(async (key) => {
        const cowCensus = { ...cowCensusDataA };
        delete cowCensus[key];

        const res = await request
          .post('/')
          .set('Authorization', 'Bearer dummy_token')
          .send(cowCensus);

        expect(res.status).toBe(500);
        expect(res.body.errors.length).toBe(1);
        expect(createSpy).not.toHaveBeenCalled();
      });
      await Promise.all(attempts);
    });

    it('blocks creation when field invalid', async () => {
      const createSpy = jest.spyOn(cowCensusService, 'createCowCensus');

      const attempts = Object.keys(cowCensusDataA).map(async (key) => {
        const cowCensus = { ...cowCensusDataA };
        if (typeof cowCensus[key] === 'number') {
          cowCensus[key] = 'some string';
        } else if (typeof cowCensus[key] === 'object') {
          cowCensus[key] = undefined;
        } else {
          cowCensus[key] = 0;
        }

        const res = await request
          .post('/')
          .set('Authorization', 'Bearer dummy_token')
          .send(cowCensus);

        expect(res.status).toBe(500);
        expect(res.body.errors.length).toBe(1);
        expect(createSpy).not.toHaveBeenCalled();
      });
      await Promise.all(attempts);
    });

    it('creates cowCensus when body is valid', async () => {
      const createSpy = jest.spyOn(cowCensusService, 'createCowCensus');

      const res = await request
        .post('/')
        .set('Authorization', 'Bearer dummy_token')
        .send(cowCensusDataA);

      expect(res.status).toBe(201);
      Object.keys(cowCensusDataA).forEach((key) => {
        if (key === 'breedingDate' || key === 'calvingDate') {
          expect(new Date(res.body[key])).toEqual(cowCensusDataA[key]);
        } else expect(res.body[key]).toBe(cowCensusDataA[key]);
      });
      expect(createSpy).toHaveBeenCalled();
      createSpy.mockClear();

      validId = String(res.body.id);
    });
  });

  describe('GET /?...=...', () => {
    it('returns 404 when cowCensus not found', async () => {
      const getSpy = jest.spyOn(cowCensusService, 'getCowCensuses');

      const res = await request
        .get(`/?id=${invalidId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(404);
      expect(getSpy).rejects.toThrowError();
      getSpy.mockClear();
    });

    it('returns cowCensuses by query', async () => {
      const getSpy = jest.spyOn(cowCensusService, 'getCowCensuses');

      const res = await request
        .get(`/?tag=${'F123456'}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      Object.keys(cowCensusDataA).forEach((key) => {
        if (key === 'breedingDate' || key === 'calvingDate') {
          expect(new Date(res.body[key])).toEqual(cowCensusDataA[key]);
        } else expect(res.body[key]).toBe(cowCensusDataA[key]);
      });
      expect(getSpy).toHaveBeenCalled();
      getSpy.mockClear();
    });
  });

  describe('GET /:id?...=...', () => {
    it('returns 404 when cowCensus not found', async () => {
      const getSpy = jest.spyOn(cowCensusService, 'getCowCensuses');

      const res = await request
        .get(`/${invalidId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(404);
      expect(getSpy).rejects.toThrowError();
      getSpy.mockClear();
    });

    it('returns single cowCensus if found - generic', async () => {
      const getSpy = jest.spyOn(cowCensusService, 'getCowCensuses');

      const res = await request
        .get(`/${validId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      Object.keys(cowCensusDataA).forEach((key) => {
        if (key === 'breedingDate' || key === 'calvingDate') {
          expect(new Date(res.body[key])).toEqual(cowCensusDataA[key]);
        } else expect(res.body[key]).toBe(cowCensusDataA[key]);
      });
      expect(getSpy).toHaveBeenCalled();
      getSpy.mockClear();
    });

    it('returns single cowCensus if found - specific query', async () => {
      const getSpy = jest.spyOn(cowCensusService, 'getCowCensuses');

      const res = await request
        .get(`/${validId}?tag=${'F123456'}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      Object.keys(cowCensusDataA).forEach((key) => {
        if (key === 'breedingDate' || key === 'calvingDate') {
          expect(new Date(res.body[key])).toEqual(cowCensusDataA[key]);
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

    it('blocks update when field invalid', async () => {
      const updateSpy = jest.spyOn(cowCensusService, 'editCowCensuses');

      const attempts = Object.keys(cowCensusDataA).concat('otherkey').map(async (key) => {
        
        const cowCensusUpdate = {
          id: validId,
        }; 
        if (key === 'breedingDate' || key === 'calvingDate') {
          cowCensusUpdate[key] = 'not a date';
        } else if (typeof cowCensusDataB[key] === 'number') {
          cowCensusUpdate[key] = 'some string';
        } else {
          cowCensusUpdate[key] = 0;
        }
        
        const res = await request
          .patch(`/${validId}`)
          .set('Authorization', 'Bearer dummy_token')
          .send(cowCensusUpdate);
        // console.log(res);

        expect(res.status).toBe(400);
        expect(res.body.errors.length).toBe(1);
        expect(updateSpy).not.toHaveBeenCalled();
      });
      await Promise.all(attempts);
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
        if (key === 'breedingDate' || key === 'calvingDate') {
          expect(new Date(res.body[key])).toEqual(cowCensusDataB[key]);
        } else expect(res.body[key]).toBe(cowCensusDataB[key]);
      });
      await Promise.all(attempts);

      expect(updateSpy).toHaveBeenCalledTimes(Object.keys(cowCensusDataB).length);
      updateSpy.mockClear();

      const res = await request
        .get(`/${validId}`)
        .set('Authorization', 'Bearer dummy_token');

      Object.keys(cowCensusDataB).forEach((key) => {
        if (key === 'breedingDate' || key === 'calvingDate') {
          expect(new Date(res.body[key])).toEqual(cowCensusDataB[key]);
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