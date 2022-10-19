import supertest from 'supertest';
import plotRouter from '../../routers/plot_router';
import { plotService } from '../../services';
import db from '../../db/db';
import { IPlot } from '../../db/models/plot';

const request = supertest(plotRouter);

const idTeam = '6aab56d3-ac8c-4f3b-a59b-c03e51c76e5d'; // from seeder

const plotDataA: Omit<IPlot, 'id'> = {
  teamId: idTeam,
  photoId: 'ef57a439-4dad-4010-86cd-b2f9d58183bb',
  latitude: 43.734173892145556,
  longitude: -72.24597964116084,
  length: 20,
  width: 20,
  name: 'Plot Data',
};

const plotDataB: Omit<IPlot, 'id'> = {
  teamId: idTeam,
  photoId: 'ef57a439-4dad-4010-86cd-b2f9d58183bb',
  latitude: 43.734173892145556,
  longitude: -72.24597964116084,
  length: 20,
  width: 20,
  name: 'Changed name',
};

let validId = '';
const invalidId = '048348e1-24ac-4d74-bb10-4e07e98a4d0b';

// Mocks requireAuth server middleware
jest.mock('../../auth/requireAuth');
jest.mock('../../auth/requireScope');
jest.mock('../../auth/requireMembership');
jest.mock('../../auth/requireSelf');

describe('Working plot router', () => {
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
      const createSpy = jest.spyOn(plotService, 'createPlot');

      const res = await request
        .post('/')
        .send(plotDataA);

      expect(res.status).toBe(403);
      expect(createSpy).not.toHaveBeenCalled();
    });

    it('blocks creation when missing field', async () => {
      const createSpy = jest.spyOn(plotService, 'createPlot');

      const attempts = Object.keys(plotDataA).map(async (key) => {
        const plot = { ...plotDataA };
        delete plot[key];

        const res = await request
          .post('/')
          .set('Authorization', 'Bearer dummy_token')
          .send(plot);

        expect(res.status).toBe(500);
        expect(res.body.errors.length).toBe(1);
        expect(createSpy).not.toHaveBeenCalled();
      });
      await Promise.all(attempts);
    });

    it('blocks creation when field invalid', async () => {
      const createSpy = jest.spyOn(plotService, 'createPlot');

      const attempts = Object.keys(plotDataA).map(async (key) => {
        const plot = { ...plotDataA };
        if (typeof plot[key] === 'number') {
          plot[key] = 'some string';
        } else if (typeof plot[key] === 'object') {
          plot[key] = undefined;
        } else {
          plot[key] = 0;
        }

        const res = await request
          .post('/')
          .set('Authorization', 'Bearer dummy_token')
          .send(plot);

        expect(res.status).toBe(500);
        expect(res.body.errors.length).toBe(1);
        expect(createSpy).not.toHaveBeenCalled();
      });
      await Promise.all(attempts);
    });

    it('creates plot when body is valid', async () => {
      const createSpy = jest.spyOn(plotService, 'createPlot');

      const res = await request
        .post('/')
        .set('Authorization', 'Bearer dummy_token')
        .send(plotDataA);

      expect(res.status).toBe(201);
      Object.keys(plotDataA).forEach((key) => {
        expect(res.body[key]).toBe(plotDataA[key]);
      });
      expect(createSpy).toHaveBeenCalled();
      createSpy.mockClear();

      validId = String(res.body.id);
    });
  });

  describe('GET /?...=...', () => {
    it('returns empty array if no plots found', async () => {
      const getSpy = jest.spyOn(plotService, 'getPlots');

      const res = await request
        .get(`/?id=${invalidId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
      getSpy.mockClear();
    });

    it('returns plots by query', async () => {
      const getSpy = jest.spyOn(plotService, 'getPlots');

      const res = await request
        .get(`/?name=${plotDataA.name}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      Object.keys(plotDataA).forEach((key) => {
        expect(res.body[0][key]).toBe(plotDataA[key]);
      });
      expect(getSpy).toHaveBeenCalled();
      getSpy.mockClear();
    });
  });

  describe('GET /:id?...=...', () => {
    it('returns 404 when plot not found', async () => {
      const getSpy = jest.spyOn(plotService, 'getPlots');

      const res = await request
        .get(`/${invalidId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(404);
      expect(getSpy).rejects.toThrowError();
      getSpy.mockClear();
    });

    it('returns single plot if found - generic', async () => {
      const getSpy = jest.spyOn(plotService, 'getPlots');

      const res = await request
        .get(`/${validId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      Object.keys(plotDataA).forEach((key) => {
        expect(res.body[key]).toBe(plotDataA[key]);
      });
      expect(getSpy).toHaveBeenCalled();
      getSpy.mockClear();
    });

    it('returns plot if found - specific query', async () => {
      const getSpy = jest.spyOn(plotService, 'getPlots');

      const res = await request
        .get(`/${validId}?name=${plotDataA.name}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      Object.keys(plotDataA).forEach((key) => {
        expect(res.body[key]).toBe(plotDataA[key]);
      });
      expect(getSpy).toHaveBeenCalled();
      getSpy.mockClear();
    });
  });

  describe('PATCH /:id', () => {
    it('requires valid permissions', async () => {
      const updateSpy = jest.spyOn(plotService, 'editPlots');

      const res = await request
        .patch(`/${validId}`)
        .send(plotDataB);

      expect(res.status).toBe(403);
      expect(updateSpy).not.toHaveBeenCalled();
    });

    it('returns 404 if plot not found', async () => {
      const updateSpy = jest.spyOn(plotService, 'editPlots');

      const res = await request
        .patch(`/${invalidId}`)
        .set('Authorization', 'Bearer dummy_token')
        .send({ ...plotDataB, id: invalidId });

      expect(res.status).toBe(404);
      expect(updateSpy).rejects.toThrowError();
      updateSpy.mockClear();
    });

    it('blocks update when field invalid', async () => {
      const updateSpy = jest.spyOn(plotService, 'editPlots');

      const attempts = Object.keys(plotDataA).concat('otherkey').map(async (key) => {
        
        const plotUpdate = {
          id: validId,
        }; 
        if (typeof plotDataB[key] === 'number') {
          plotUpdate[key] = 'some string';
        } else {
          plotUpdate[key] = 0;
        }
        
        const res = await request
          .patch(`/${validId}`)
          .set('Authorization', 'Bearer dummy_token')
          .send(plotUpdate);
        // console.log(res);

        expect(res.status).toBe(400);
        expect(res.body.errors.length).toBe(1);
        expect(updateSpy).not.toHaveBeenCalled();
      });
      await Promise.all(attempts);
    });

    it('updates plot when body is valid', async () => {
      const updateSpy = jest.spyOn(plotService, 'editPlots');

      const attempts = Object.keys(plotDataB).map(async (key) => {
        const plotUpdate = { [key]: plotDataB[key] };

        const res = await request
          .patch(`/${validId}`)
          .set('Authorization', 'Bearer dummy_token')
          .send(plotUpdate);

        expect(res.status).toBe(200);
        expect(res.body[key]).toBe(plotDataB[key]);
      });
      await Promise.all(attempts);

      expect(updateSpy).toHaveBeenCalledTimes(Object.keys(plotDataB).length);
      updateSpy.mockClear();

      const res = await request
        .get(`/${validId}`)
        .set('Authorization', 'Bearer dummy_token');

      Object.keys(plotDataB).forEach((key) => {
        expect(res.body[key]).toBe(plotDataB[key]);
      });
    });
  });

  describe('DELETE /:id', () => {
    it('requires valid permissions', async () => {
      const deleteSpy = jest.spyOn(plotService, 'deletePlots');

      const res = await request.delete(`/${validId}`);

      expect(res.status).toBe(403);
      expect(deleteSpy).not.toHaveBeenCalled();
    });

    it('returns 404 if plot not found', async () => {
      const deleteSpy = jest.spyOn(plotService, 'deletePlots');

      const res = await request
        .delete(`/${invalidId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(404);
      expect(deleteSpy).rejects.toThrowError();
      deleteSpy.mockClear();
    });

    it('deletes plot', async () => {
      const deleteSpy = jest.spyOn(plotService, 'deletePlots');

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