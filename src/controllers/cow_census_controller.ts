import { RequestHandler } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { getSuccessfulDeletionMessage } from '../constants';
import { cowCensusService } from 'services';
import { CreateCowCensusRequest, UpdateCowCensusRequest } from 'validation/cow_census';
import { ICowCensus } from 'db/models/cow_census';
import { BaseError } from 'errors';

const createCowCensus: RequestHandler = async (req: ValidatedRequest<CreateCowCensusRequest>, res, next) => {
  try {
    const {
      herdId,
      photoId,
      bcs,
      notes,
      tag,
    } = req.body;

    const newCowCensus = await cowCensusService.createCowCensus({ 
      herdId,
      photoId,
      bcs,
      notes,
      tag,
    });

    res.status(201).json(newCowCensus);
  } catch (error) {
    next(error);
  }
};

const getCowCensus: RequestHandler = async (req, res, next) => {
  try {
    const herds : ICowCensus[] = await cowCensusService.getCowCensuses({ id: req.params.id });
    if (herds.length === 0) throw new BaseError('CowCensus not found', 404);
    else res.status(200).json(herds[0]);
  } catch (error) {
    next(error);
  }
};

const updateCowCensus: RequestHandler = async (req: ValidatedRequest<UpdateCowCensusRequest>, res, next) => {
  try {
    const {
      herdId,
      photoId,
      bcs,
      notes,
      tag,
    } = req.body;

    const updatedCowCensuses = await cowCensusService.editCowCensuses(
      { herdId, photoId, bcs, notes, tag },
      { id: req.params.id },
    );

    if (updatedCowCensuses.length === 0) throw new BaseError('CowCensus not found', 404);
    else res.status(200).json(updatedCowCensuses[0]);
  } catch (error) {
    next(error);
  }
};

const deleteCowCensus: RequestHandler = async (req, res, next) => {
  try {
    const herds : ICowCensus[] = await cowCensusService.getCowCensuses({ id: req.params.id });
    if (herds.length === 0) throw new BaseError('CowCensus not found', 404);
    else {
      await cowCensusService.deleteCowCensuses({ id: req.params.id });
      res.json({ message: getSuccessfulDeletionMessage(req.params.id) });
    }
  } catch (error) {
    next(error);
  }
};

const herdController = {
  createCowCensus,
  getCowCensus,
  updateCowCensus,
  deleteCowCensus,
};

export default herdController;