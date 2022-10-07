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
      bcs,
      notes,
      tag,
      photo,
    } = req.body;

    const newCowCensus = await cowCensusService.createCowCensus({ 
      herdId,
      bcs,
      notes,
      tag,
    }, photo);
    console.log('here2');

    res.status(201).json(newCowCensus);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getCowCensuses: RequestHandler = async (req, res, next) => {
  try {
    const id = req.query?.id as string;
    const herdId = req.query?.name as string;
    const photoId = req.query?.photoId as string;
    const bcs = Number(req.query?.bcs);
    const notes = req.query?.notes as string;
    const tag = req.query?.tag as string;

    const cowCensuses = await cowCensusService.getCowCensuses({
      id,
      herdId,
      photoId,
      bcs,
      notes,
      tag,
    });
    res.status(200).json(cowCensuses);
  } catch (error) {
    next(error);
  }
};

const getCowCensus: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id ;
    const herdId = req.query?.name as string;
    const photoId = req.query?.photoId as string;
    const bcs = Number(req.query?.bcs);
    const notes = req.query?.notes as string;
    const tag = req.query?.tag as string;
    
    const cowCensuses = await cowCensusService.getCowCensuses({
      id,
      herdId,
      photoId,
      bcs,
      notes,
      tag,
    });
    if (cowCensuses.length === 0) throw new BaseError('cowCensus not found', 404);
    if (cowCensuses.length > 1) throw new BaseError('Multiple cowCensus found', 404);
    else res.status(200).json(cowCensuses[0]);
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
    const cowCensuses : ICowCensus[] = await cowCensusService.getCowCensuses({ id: req.params.id });
    if (cowCensuses.length === 0) throw new BaseError('CowCensus not found', 404);
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
  getCowCensuses,
  getCowCensus,
  updateCowCensus,
  deleteCowCensus,
};

export default herdController;