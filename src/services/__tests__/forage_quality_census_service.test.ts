import { forageQualityCensusService } from 'services';
import db from '../../db/db';
import { IForageQualityCensus } from 'db/models/forage_quality_census';
import dotenv from 'dotenv';

dotenv.config();

const idPlot = '7c175ec1-6822-43d1-962e-8bed235100f6'; // from seeder
const idPhoto = null; // TODO: base64

let idForageQualityCensus = '';
const invalidForageQualityCensusId = 'b278754a-fe80-465b-801f-4546c26e353d';

const forageQualityCensusData: Omit<IForageQualityCensus, 'id'> = {
  plotId: idPlot,
  photoId: idPhoto,
  rating: 9,
  notes: 'Pack my box with five dozen liquor jugs.',
};

describe('forageQualityCensusService', () => {
  beforeAll(async () => {
    try {
      await db.authenticate();
      await db.sync();
    } catch (error) {
      console.log(error);
      throw new Error('Unable to connect to database...');
    }
  });
  
  describe('createForageQualityCensus', () => {
    it('Can create forageQualityCensus', async () => {
      const forageQualityCensus: IForageQualityCensus = await forageQualityCensusService.createForageQualityCensus(forageQualityCensusData);

      expect(forageQualityCensus.id).toBeDefined();
      expect(forageQualityCensus.plotId).toBe(forageQualityCensus.plotId);
      expect(forageQualityCensus.photoId).toBe(forageQualityCensusData.photoId);
      expect(forageQualityCensus.rating).toBe(forageQualityCensusData.rating);
      expect(forageQualityCensus.notes).toBe(forageQualityCensusData.notes);
      idForageQualityCensus = forageQualityCensus.id;
    });
  });

  describe('getForageQualityCensuses', () => {
    it('Can get forageQualityCensus', async () => {
      const forageQualityCensus: IForageQualityCensus = await forageQualityCensusService.getForageQualityCensuses({ id: idForageQualityCensus }).then((res: IForageQualityCensus[]) => res[0]);

      expect(forageQualityCensus.id).toBe(idForageQualityCensus);
      expect(forageQualityCensus.plotId).toBe(forageQualityCensusData.plotId);
      expect(forageQualityCensus.photoId).toBe(forageQualityCensusData.photoId);
      expect(forageQualityCensus.rating).toBe(forageQualityCensusData.rating);
      expect(forageQualityCensus.notes).toBe(forageQualityCensusData.notes);
    });

    it('Returns empty array if no forageQualityCensuses to get', async () => {
      expect(await forageQualityCensusService.getForageQualityCensuses({ id: invalidForageQualityCensusId })).toStrictEqual([]);
    });
  });

  describe('editForageQualityCensuses', () => {
    it('Updates forageQualityCensus field', async () => {
      const updatedForageQualityCensus1: IForageQualityCensus 
        = await forageQualityCensusService.editForageQualityCensuses({ rating: 8, notes: 'ForageQuality was fat today' }, { id: idForageQualityCensus }).then((res: IForageQualityCensus[]) => res[0]);
      expect(updatedForageQualityCensus1.id).toBe(idForageQualityCensus);
      expect(updatedForageQualityCensus1.plotId).toBe(forageQualityCensusData.plotId);
      expect(updatedForageQualityCensus1.photoId).toBe(forageQualityCensusData.photoId);
      expect(updatedForageQualityCensus1.rating).toBe(8);
      expect(updatedForageQualityCensus1.notes).toEqual('ForageQuality was fat today');

      const updatedForageQualityCensus2: IForageQualityCensus = await forageQualityCensusService.getForageQualityCensuses({ id: idForageQualityCensus }).then((res: IForageQualityCensus[]) => res[0]);
      expect(updatedForageQualityCensus2.id).toBe(idForageQualityCensus);
      expect(updatedForageQualityCensus2.plotId).toBe(forageQualityCensusData.plotId);
      expect(updatedForageQualityCensus2.photoId).toBe(forageQualityCensusData.photoId);
      expect(updatedForageQualityCensus2.rating).toBe(8);
      expect(updatedForageQualityCensus2.notes).toEqual('ForageQuality was fat today');
    });

    it('Returns empty array if no forageQualityCensuses to edit', async () => {
      expect(await forageQualityCensusService.editForageQualityCensuses({ notes: 'ForageQuality was not fat today' }, { id: invalidForageQualityCensusId })).toStrictEqual([]);
    });
  });

  describe('deleteForageQualityCensuses', () => {
    it('Deletes existing forageQualityCensus', async () => {
      await forageQualityCensusService.deleteForageQualityCensuses({ id: idForageQualityCensus });
      expect(await forageQualityCensusService.getForageQualityCensuses({ id: idForageQualityCensus })).toStrictEqual([]);
    });

    it('Reports zero deleted rows if no forageQualityCensuses to delete', async () => {
      expect(await forageQualityCensusService.deleteForageQualityCensuses({ id: invalidForageQualityCensusId })).toStrictEqual(0);
    });
  });
});