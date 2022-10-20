import { RequestHandler } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { getSuccessfulDeletionMessage } from '../constants';
import { forageQualityCensusService } from 'services';
import { CreateForageQualityCensusRequest, UpdateForageQualityCensusRequest } from 'validation/forage_quality_census';
import { IForageQualityCensus } from 'db/models/forage_quality_census';
import { BaseError } from 'errors';

const createForageQualityCensus: RequestHandler = async (req: ValidatedRequest<CreateForageQualityCensusRequest>, res, next) => {
  try {
    const {
      plotId,
      photo,
      rating,
      notes,
    } = req.body;

    const newForageQualityCensus = await forageQualityCensusService.createForageQualityCensus({ 
      plotId,
      rating,
      notes,
    }, photo);

    res.status(201).json(newForageQualityCensus);
  } catch (error) {
    next(error);
  }
};

const getForageQualityCensuses: RequestHandler = async (req, res, next) => {
  try {
    const id = req.query?.id as string;
    const plotId = req.query?.plotId as string;
    const photoId = req.query?.photoId as string;
    const rating = Number(req.query?.rating);
    const notes = req.query?.notes as string;
    
    const forageQualityCensuses = await forageQualityCensusService.getForageQualityCensuses({
      id,
      plotId,
      photoId,
      rating,
      notes,
    });
    res.status(200).json(forageQualityCensuses[0]);
  } catch (error) {
    next(error);
  }
};

const getForageQualityCensus: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const plotId = req.query?.plotId as string;
    const photoId = req.query?.photoId as string;
    const rating = Number(req.query?.rating);
    const notes = req.query?.notes as string;
    
    const forageQualityCensuses = await forageQualityCensusService.getForageQualityCensuses({
      id,
      plotId,
      photoId,
      rating,
      notes,
    });
    if (forageQualityCensuses.length === 0) throw new BaseError('ForageQualityCensus not found', 404);
    else if (forageQualityCensuses.length > 1) throw new BaseError('Multiple ForageQualityCensus entries found', 404);
    else res.status(200).json(forageQualityCensuses[0]);
  } catch (error) {
    next(error);
  }
};

const updateForageQualityCensus: RequestHandler = async (req: ValidatedRequest<UpdateForageQualityCensusRequest>, res, next) => {
  try {
    const {
      plotId,
      photoId,
      rating,
      notes,
    } = req.body;

    const updatedForageQualityCensuses = await forageQualityCensusService.editForageQualityCensuses(
      { plotId, photoId, rating, notes },
      { id: req.params.id },
    );

    if (updatedForageQualityCensuses.length === 0) throw new BaseError('ForageQualityCensus not found', 404);
    else res.status(200).json(updatedForageQualityCensuses[0]);
  } catch (error) {
    next(error);
  }
};

const deleteForageQualityCensus: RequestHandler = async (req, res, next) => {
  try {
    const forageQualityCensuses : IForageQualityCensus[] = await forageQualityCensusService.getForageQualityCensuses({ id: req.params.id });
    if (forageQualityCensuses.length === 0) throw new BaseError('ForageQualityCensus not found', 404);
    else {
      await forageQualityCensusService.deleteForageQualityCensuses({ id: req.params.id });
      res.json({ message: getSuccessfulDeletionMessage(req.params.id) });
    }
  } catch (error) {
    next(error);
  }
};

const forageQualityCensusController = {
  createForageQualityCensus,
  getForageQualityCensuses,
  getForageQualityCensus,
  updateForageQualityCensus,
  deleteForageQualityCensus,
};

export default forageQualityCensusController;