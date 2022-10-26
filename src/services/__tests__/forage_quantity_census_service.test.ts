import { forageQuantityCensusService } from 'services';
import db from '../../db/db';
import { IForageQuantityCensus } from 'db/models/forage_quantity_census';
import dotenv from 'dotenv';

dotenv.config();

const idPlot = '7c175ec1-6822-43d1-962e-8bed235100f6'; // from seeder
const idPhoto = null; // TODO: base64

let idForageQuantityCensus = '';
const invalidForageQuantityCensusId = 'a47b3b8d-2e1b-4a80-97a1-44c1ebe585bb';

const forageQuantityCensusData: Omit<IForageQuantityCensus, 'id'> = {
  plotId: idPlot,
  photoId: idPhoto,
  sda: 9,
  notes: 'This is a forage quantity note',
};

describe('forageQuantityCensusService', () => {
  beforeAll(async () => {
    try {
      await db.authenticate();
      await db.sync();
    } catch (error) {
      console.log(error);
      throw new Error('Unable to connect to database...');
    }
  });
  
  describe('createForageQuantityCensus', () => {
    it('Can create forageQuantityCensus', async () => {
      const forageQuantityCensus: IForageQuantityCensus = await forageQuantityCensusService.createForageQuantityCensus(forageQuantityCensusData);

      expect(forageQuantityCensus.id).toBeDefined();
      expect(forageQuantityCensus.plotId).toBe(forageQuantityCensus.plotId);
      expect(forageQuantityCensus.photoId).toBe(forageQuantityCensusData.photoId);
      expect(forageQuantityCensus.sda).toBe(forageQuantityCensusData.sda);
      expect(forageQuantityCensus.notes).toBe(forageQuantityCensusData.notes);
      idForageQuantityCensus = forageQuantityCensus.id;
    });
  });

  describe('getForageQuantityCensuses', () => {
    it('Can get forageQuantityCensus', async () => {
      const forageQuantityCensus: IForageQuantityCensus = await forageQuantityCensusService.getForageQuantityCensuses({ id: idForageQuantityCensus }).then((res: IForageQuantityCensus[]) => res[0]);

      expect(forageQuantityCensus.id).toBe(idForageQuantityCensus);
      expect(forageQuantityCensus.plotId).toBe(forageQuantityCensusData.plotId);
      expect(forageQuantityCensus.photoId).toBe(forageQuantityCensusData.photoId);
      expect(forageQuantityCensus.sda).toBe(forageQuantityCensusData.sda);
      expect(forageQuantityCensus.notes).toBe(forageQuantityCensusData.notes);
    });

    it('Returns empty array if no forageQuantityCensuses to get', async () => {
      expect(await forageQuantityCensusService.getForageQuantityCensuses({ id: invalidForageQuantityCensusId })).toStrictEqual([]);
    });
  });

  describe('editForageQuantityCensuses', () => {
    it('Updates forageQuantityCensus field', async () => {
      const updatedForageQuantityCensus1: IForageQuantityCensus 
        = await forageQuantityCensusService.editForageQuantityCensuses(
          { sda: 8, notes: 'ForageQuantity was fat today' }, 
          { id: idForageQuantityCensus },
        ).then((res: IForageQuantityCensus[]) => res[0]);
      expect(updatedForageQuantityCensus1.id).toBe(idForageQuantityCensus);
      expect(updatedForageQuantityCensus1.plotId).toBe(forageQuantityCensusData.plotId);
      expect(updatedForageQuantityCensus1.photoId).toBe(forageQuantityCensusData.photoId);
      expect(updatedForageQuantityCensus1.sda).toBe(8);
      expect(updatedForageQuantityCensus1.notes).toEqual('ForageQuantity was fat today');

      const updatedForageQuantityCensus2: IForageQuantityCensus 
        = await forageQuantityCensusService.getForageQuantityCensuses(
          { id: idForageQuantityCensus },
        ).then((res: IForageQuantityCensus[]) => res[0]);
      expect(updatedForageQuantityCensus2.id).toBe(idForageQuantityCensus);
      expect(updatedForageQuantityCensus2.plotId).toBe(forageQuantityCensusData.plotId);
      expect(updatedForageQuantityCensus2.photoId).toBe(forageQuantityCensusData.photoId);
      expect(updatedForageQuantityCensus2.sda).toBe(8);
      expect(updatedForageQuantityCensus2.notes).toEqual('ForageQuantity was fat today');
    });

    it('Returns empty array if no forageQuantityCensuses to edit', async () => {
      expect(await forageQuantityCensusService.editForageQuantityCensuses({ notes: 'ForageQuantity was not fat today' }, { id: invalidForageQuantityCensusId })).toStrictEqual([]);
    });
  });

  describe('deleteForageQuantityCensuses', () => {
    it('Deletes existing forageQuantityCensus', async () => {
      await forageQuantityCensusService.deleteForageQuantityCensuses({ id: idForageQuantityCensus });
      expect(await forageQuantityCensusService.getForageQuantityCensuses({ id: idForageQuantityCensus })).toStrictEqual([]);
    });

    it('Reports zero deleted rows if no forageQuantityCensuses to delete', async () => {
      expect(await forageQuantityCensusService.deleteForageQuantityCensuses({ id: invalidForageQuantityCensusId })).toStrictEqual(0);
    });
  });
});