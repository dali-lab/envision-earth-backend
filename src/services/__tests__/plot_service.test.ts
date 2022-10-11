import { plotService } from 'services';
import db from '../../db/db';
import { IPlot } from 'db/models/plot';
import dotenv from 'dotenv';

dotenv.config();

const idTeam = '6aab56d3-ac8c-4f3b-a59b-c03e51c76e5d'; // from seeder

let idPlot = '';
const invalidPlotId = '3ce27855-1d0d-44de-a554-ace01f4ba749';

const plotData: Omit<IPlot, 'id'> = {
  teamId: idTeam,
  photoId: 'ef57a439-4dad-4010-86cd-b2f9d58183bb',
  latitude: 43.734173892145556,
  longitude: -72.24597964116084,
  length: 20,
  width: 20,
  name: 'Plot Data',
};

describe('plotService', () => {
  beforeAll(async () => {
    try {
      await db.authenticate();
      await db.sync();
    } catch (error) {
      console.log(error);
      throw new Error('Unable to connect to database...');
    }
  });
  
  describe('createPlot', () => {
    it('Can create plot', async () => {
      const plot: IPlot = await plotService.createPlot(plotData);

      expect(plot.id).toBeDefined();
      expect(plot.teamId).toBe(plotData.teamId);
      expect(plot.latitude).toBe(plotData.latitude);
      expect(plot.longitude).toBe(plotData.longitude);
      expect(plot.length).toBe(plotData.length);
      expect(plot.width).toBe(plotData.width);
      expect(plot.name).toBe(plotData.name);
      idPlot = plot.id;
    });
  });

  describe('getPlots', () => {
    it('Can get plot', async () => {
      const plot: IPlot = await plotService.getPlots({ id: idPlot }).then((res: IPlot[]) => res[0]);

      expect(plot.id).toBe(idPlot);
      expect(plot.teamId).toBe(plotData.teamId);
      expect(plot.latitude).toBe(plotData.latitude);
      expect(plot.longitude).toBe(plotData.longitude);
      expect(plot.length).toBe(plotData.length);
      expect(plot.width).toBe(plotData.width);
      expect(plot.name).toBe(plotData.name);
    });

    it('Returns empty array if no plots to get', async () => {
      expect(await plotService.getPlots({ id: invalidPlotId })).toStrictEqual([]);
    });
  });

  describe('editPlots', () => {
    it('Updates plot field', async () => {
      const updatedPlot1: IPlot = await plotService.editPlots({ name: 'Changed name' }, { id: idPlot }).then((res: IPlot[]) => res[0]);
      expect(updatedPlot1.id).toBe(idPlot);
      expect(updatedPlot1.teamId).toBe(plotData.teamId);
      expect(updatedPlot1.latitude).toBe(plotData.latitude);
      expect(updatedPlot1.longitude).toBe(plotData.longitude);
      expect(updatedPlot1.length).toBe(plotData.length);
      expect(updatedPlot1.width).toBe(plotData.width);
      expect(updatedPlot1.name).toBe('Changed name');

      const updatedPlot2: IPlot = await plotService.getPlots({ id: idPlot }).then((res: IPlot[]) => res[0]);
      expect(updatedPlot2.id).toBe(idPlot);
      expect(updatedPlot2.teamId).toBe(plotData.teamId);
      expect(updatedPlot2.latitude).toBe(plotData.latitude);
      expect(updatedPlot2.longitude).toBe(plotData.longitude);
      expect(updatedPlot2.length).toBe(plotData.length);
      expect(updatedPlot2.width).toBe(plotData.width);
      expect(updatedPlot2.name).toBe('Changed name');
    });

    it('Returns empty array if no plots to edit', async () => {
      expect(await plotService.editPlots({ name: 'Should not resolve' }, { id: invalidPlotId })).toStrictEqual([]);
    });
  });

  describe('deletePlots', () => {
    it('Deletes existing plot', async () => {
      await plotService.deletePlots({ id: idPlot });
      expect(await plotService.getPlots({ id: idPlot })).toStrictEqual([]);
    });

    it('Reports zero deleted rows if no plots to delete', async () => {
      expect(await plotService.deletePlots({ id: invalidPlotId })).toStrictEqual(0);
    });
  });
});