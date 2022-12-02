import { RequestHandler } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { cowCensusService, dungCensusService, forageQualityCensusService, forageQuantityCensusService } from 'services';
import { CreateSyncRequest } from 'validation/sync';
import { ICowCensus } from 'db/models/cow_census';
import { IDungCensus } from 'db/models/dung_census';
import { IForageQualityCensus } from 'db/models/forage_quality_census';
import { IForageQuantityCensus } from 'db/models/forage_quantity_census';

interface SyncResponse {
  cowCensuses: ICowCensus[],
  dungCensuses: IDungCensus[],
  forageQualityCensuses: IForageQualityCensus[],
  forageQuantityCensuses: IForageQuantityCensus[],
}

const sync: RequestHandler = async (req: ValidatedRequest<CreateSyncRequest>, res, next) => {
  try {
    const { upserted } = req.body;
    const result: SyncResponse = {
      cowCensuses: [],
      dungCensuses: [],
      forageQualityCensuses: [],
      forageQuantityCensuses: [],
    };
    
    for (const census of upserted.cowCensusRequests) {
      const {
        herdId,
        plotId,
        bcs,
        notes,
        tag,
        photo,
      } = census; 
      const newCowCensus = await cowCensusService.createCowCensus({ 
        herdId,
        plotId,
        bcs,
        notes,
        tag,
      }, photo);
      result.cowCensuses.push(newCowCensus);
    }
    for (const census of upserted.dungCensusRequests) {
      const {
        herdId,
        plotId,
        photo,
        ratings,
        notes,
      } = census;
      const newDungCensus = await dungCensusService.createDungCensus({ 
        herdId,
        plotId,
        ratings,
        notes,
      }, photo);
      result.dungCensuses.push(newDungCensus);
    }
    for (const census of upserted.forageQualityCensusRequests) {
      const {
        plotId,
        photo,
        rating,
        notes,
      } = census;
      const newForageQualityCensus = await forageQualityCensusService.createForageQualityCensus({ 
        plotId,
        rating,
        notes,
      }, photo);
      result.forageQualityCensuses.push(newForageQualityCensus);
    }
    for (const census of upserted.forageQuantityCensusRequests) {
      const {
        plotId,
        photo,
        sda,
        notes,
      } = census;
      const newForageQuantityCensus = await forageQuantityCensusService.createForageQuantityCensus({ 
        plotId,
        sda,
        notes,
      }, photo);
      result.forageQuantityCensuses.push(newForageQuantityCensus);
    }

    console.log('Sync result:', result);
    res.status(201).json(result);
    return result;
  } catch (error) {
    // If there is even one error in upload,
    // entire batch fails
    next(error);
  }
};

const syncController = {
  sync,
};

export default syncController;