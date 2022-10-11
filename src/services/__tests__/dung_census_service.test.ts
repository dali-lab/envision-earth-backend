import { dungCensusService } from 'services';
import db from '../../db/db';
import { IDungCensus } from 'db/models/dung_census';
import dotenv from 'dotenv';

dotenv.config();

const idHerd = '187dc38d-bc3a-4eb4-ac99-74e04de04d48'; // from seeder
const idPlot = '7c175ec1-6822-43d1-962e-8bed235100f6'; // from seeder
const idPhoto = null; // TODO: base64

let idDungCensus = '';
const invalidDungCensusId = '0ff0d7bf-110a-4b1a-91fc-5ac725d13e65';

const dungCensusData: Omit<IDungCensus, 'id'> = {
  herdId: idHerd,
  plotId: idPlot,
  photoId: idPhoto,
  ratings: [0.65, -0.15, 0.03],
  notes: 'Sphinx of black quartz, judge my vow',
};

describe('dungCensusService', () => {
  beforeAll(async () => {
    try {
      await db.authenticate();
      await db.sync();
    } catch (error) {
      console.log(error);
      throw new Error('Unable to connect to database...');
    }
  });
  
  describe('createDungCensus', () => {
    it('Can create dungCensus', async () => {
      const dungCensus: IDungCensus = await dungCensusService.createDungCensus(dungCensusData);

      expect(dungCensus.id).toBeDefined();
      expect(dungCensus.herdId).toBe(dungCensusData.herdId);
      expect(dungCensus.plotId).toBe(dungCensusData.plotId);
      expect(dungCensus.photoId).toBe(dungCensusData.photoId);
      expect(dungCensus.ratings).toEqual(dungCensusData.ratings);
      expect(dungCensus.notes).toBe(dungCensusData.notes);
      idDungCensus = dungCensus.id;
    });
  });

  describe('getDungCensuses', () => {
    it('Can get dungCensus', async () => {
      const dungCensus: IDungCensus = await dungCensusService.getDungCensuses({ id: idDungCensus }).then((res: IDungCensus[]) => res[0]);

      expect(dungCensus.id).toBe(idDungCensus);
      expect(dungCensus.herdId).toBe(dungCensusData.herdId);
      expect(dungCensus.plotId).toBe(dungCensusData.plotId);
      expect(dungCensus.photoId).toBe(dungCensusData.photoId);
      expect(dungCensus.ratings).toEqual(dungCensusData.ratings);
      expect(dungCensus.notes).toBe(dungCensusData.notes);
    });

    it('Returns empty array if no dungCensuses to get', async () => {
      expect(await dungCensusService.getDungCensuses({ id: invalidDungCensusId })).toStrictEqual([]);
    });
  });

  describe('editDungCensuses', () => {
    it('Updates dungCensus field', async () => {
      const updatedDungCensus1: IDungCensus = await dungCensusService.editDungCensuses({ 
        ratings: [0.65, -0.15, 0.03, 0.01], 
        notes: 'Dung was fat today' }, { id: idDungCensus }).then((res: IDungCensus[]) => res[0]);
      expect(updatedDungCensus1.id).toBe(idDungCensus);
      expect(updatedDungCensus1.herdId).toBe(dungCensusData.herdId);
      expect(updatedDungCensus1.plotId).toBe(dungCensusData.plotId);
      expect(updatedDungCensus1.photoId).toBe(dungCensusData.photoId);
      expect(updatedDungCensus1.ratings).toEqual([0.65, -0.15, 0.03, 0.01]);
      expect(updatedDungCensus1.notes).toEqual('Dung was fat today');

      const updatedDungCensus2: IDungCensus = await dungCensusService.getDungCensuses({ id: idDungCensus }).then((res: IDungCensus[]) => res[0]);
      expect(updatedDungCensus2.id).toBe(idDungCensus);
      expect(updatedDungCensus2.herdId).toBe(dungCensusData.herdId);
      expect(updatedDungCensus2.plotId).toBe(dungCensusData.plotId);
      expect(updatedDungCensus2.photoId).toBe(dungCensusData.photoId);
      expect(updatedDungCensus2.ratings).toEqual([0.65, -0.15, 0.03, 0.01]);
      expect(updatedDungCensus2.notes).toEqual('Dung was fat today');
    });

    it('Returns empty array if no dungCensuses to edit', async () => {
      expect(await dungCensusService.editDungCensuses({ notes: 'Dung was not fat today' }, { id: invalidDungCensusId })).toStrictEqual([]);
    });
  });

  describe('deleteDungCensuses', () => {
    it('Deletes existing dungCensus', async () => {
      await dungCensusService.deleteDungCensuses({ id: idDungCensus });
      expect(await dungCensusService.getDungCensuses({ id: idDungCensus })).toStrictEqual([]);
    });

    it('Reports zero deleted rows if no dungCensuses to delete', async () => {
      expect(await dungCensusService.deleteDungCensuses({ id: invalidDungCensusId })).toStrictEqual(0);
    });
  });
});