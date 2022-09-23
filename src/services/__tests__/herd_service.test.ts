import { herdService } from 'services';
import db from '../../db/db';
import { IHerd } from 'db/models/herd';
import dotenv from 'dotenv';

dotenv.config();

const idTeam = '6aab56d3-ac8c-4f3b-a59b-c03e51c76e5d'; // from seeder

let idHerd = '';
const invalidHerdId = '4bcc52d8-7147-477b-9304-06e0da2783ae';

const herdData: Omit<IHerd, 'id'> = {
  teamId: idTeam,
  species: 'Holstein Friesian',
  count: 10,
  breedingDate: new Date('2022-09-21'),
  calvingDate: new Date('2023-04-21 21:50:56.305-04'),
};

describe('herdService', () => {
  beforeAll(async () => {
    try {
      await db.authenticate();
      await db.sync();
    } catch (error) {
      console.log(error);
      throw new Error('Unable to connect to database...');
    }
  });
  
  describe('createHerd', () => {
    it('Can create herd', async () => {
      const herd: IHerd = await herdService.createHerd(herdData);

      expect(herd.id).toBeDefined();
      expect(herd.teamId).toBe(herdData.teamId);
      expect(herd.count).toBe(herdData.count);
      expect(herd.breedingDate).toEqual(herdData.breedingDate);
      expect(herd.calvingDate).toEqual(herdData.calvingDate);
      idHerd = herd.id;
    });
  });

  describe('getHerds', () => {
    it('Can get herd', async () => {
      const herd: IHerd = await herdService.getHerds({ id: idHerd }).then((res: IHerd[]) => res[0]);

      expect(herd.id).toBe(idHerd);
      expect(herd.teamId).toBe(herdData.teamId);
      expect(herd.count).toBe(herdData.count);
      expect(herd.breedingDate).toEqual(herdData.breedingDate);
      expect(herd.calvingDate).toEqual(herdData.calvingDate);
    });

    it('Returns empty array if no herds to get', async () => {
      expect(await herdService.getHerds({ id: invalidHerdId })).toStrictEqual([]);
    });
  });

  describe('editHerds', () => {
    it('Updates herd field', async () => {
      const updatedHerd1: IHerd = await herdService.editHerds({ count: 11, species: 'Aberdeen Angus' }, { id: idHerd }).then((res: IHerd[]) => res[0]);
      expect(updatedHerd1.id).toBe(idHerd);
      expect(updatedHerd1.teamId).toBe(herdData.teamId);
      expect(updatedHerd1.count).toBe(11);
      expect(updatedHerd1.species).toBe('Aberdeen Angus');
      expect(updatedHerd1.breedingDate).toEqual(herdData.breedingDate);
      expect(updatedHerd1.calvingDate).toEqual(herdData.calvingDate);

      const updatedHerd2: IHerd = await herdService.getHerds({ id: idHerd }).then((res: IHerd[]) => res[0]);
      expect(updatedHerd2.id).toBe(idHerd);
      expect(updatedHerd2.teamId).toBe(herdData.teamId);
      expect(updatedHerd2.count).toBe(11);
      expect(updatedHerd2.species).toBe('Aberdeen Angus');
      expect(updatedHerd2.breedingDate).toEqual(herdData.breedingDate);
      expect(updatedHerd2.calvingDate).toEqual(herdData.calvingDate);
    });

    it('Returns empty array if no herds to edit', async () => {
      expect(await herdService.editHerds({ count: 11, species: 'Aberdeen Angus' }, { id: invalidHerdId })).toStrictEqual([]);
    });
  });

  describe('deleteHerds', () => {
    it('Deletes existing herd', async () => {
      await herdService.deleteHerds({ id: idHerd });
      expect(await herdService.getHerds({ id: idHerd })).toStrictEqual([]);
    });

    it('Reports zero deleted rows if no herds to delete', async () => {
      expect(await herdService.deleteHerds({ id: invalidHerdId })).toStrictEqual(0);
    });
  });
});