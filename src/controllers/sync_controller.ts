import { RequestHandler } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { cowCensusService } from 'services';
import { CreateSyncRequest } from 'validation/sync';
import { inspect } from 'util';
import { ICowCensus } from 'db/models/cow_census';
import { ICreateCowCensusRequest } from 'validation/cow_census';

interface SyncResponse {
  cowCensuses: ICowCensus[],
}

const sync: RequestHandler = async (req: ValidatedRequest<CreateSyncRequest>, res, next) => {
  try {
    const { upserted } = req.body;
    const result: SyncResponse = {
      cowCensuses: [],
    };
    
    upserted.cowCensusRequests.forEach(async (census: ICreateCowCensusRequest) => {
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
    });

    // We've kept this to monitor syncing in prod, 
    // but this can be removed once there is total confidence in syncing
    console.log('Sync result:', inspect(result, { depth: 5 }));
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