import { RequestHandler } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { getSuccessfulDeletionMessage } from '../constants';
import { dungCensusService } from 'services';
import { CreateDungCensusRequest, UpdateDungCensusRequest } from 'validation/dung_census';
import { IDungCensus } from 'db/models/dung_census';
import { BaseError } from 'errors';

const createDungCensus: RequestHandler = async (req: ValidatedRequest<CreateDungCensusRequest>, res, next) => {
  try {
    const {
      herdId,
      plotId,
      photo,
      ratings,
      notes,
    } = req.body;

    const newDungCensus = await dungCensusService.createDungCensus({ 
      herdId,
      plotId,
      ratings,
      notes,
    }, photo);

    res.status(201).json(newDungCensus);
  } catch (error) {
    next(error);
  }
};

const getDungCensus: RequestHandler = async (req, res, next) => {
  try {
    // Cannot query by ratings here
    const id = req.query?.id as string;
    const herdId = req.query?.herdId as string;
    const plotId = req.query?.plotId as string;
    const photoId = req.query?.photoId as string;
    const notes = req.query?.notes as string;

    const dungCensuses = await dungCensusService.getDungCensuses({
      id,
      herdId,
      plotId,
      photoId,
      notes,
    });

    if (dungCensuses.length === 0) throw new BaseError('no dungCensus entries found', 404);
    else res.status(200).json(dungCensuses[0]);
  } catch (error) {
    next(error);
  }
};

const updateDungCensus: RequestHandler = async (req: ValidatedRequest<UpdateDungCensusRequest>, res, next) => {
  try {
    const {
      herdId,
      plotId,
      photoId,
      ratings,
      notes,
    } = req.body;

    const updatedDungCensuses = await dungCensusService.editDungCensuses(
      { herdId, plotId, photoId, ratings, notes },
      { id: req.params.id },
    );

    if (updatedDungCensuses.length === 0) throw new BaseError('DungCensus not found', 404);
    else res.status(200).json(updatedDungCensuses[0]);
  } catch (error) {
    next(error);
  }
};

const deleteDungCensus: RequestHandler = async (req, res, next) => {
  try {
    const dungCensuses : IDungCensus[] = await dungCensusService.getDungCensuses({ id: req.params.id });
    if (dungCensuses.length === 0) throw new BaseError('DungCensus not found', 404);
    else {
      await dungCensusService.deleteDungCensuses({ id: req.params.id });
      res.json({ message: getSuccessfulDeletionMessage(req.params.id) });
    }
  } catch (error) {
    next(error);
  }
};

const herdController = {
  createDungCensus,
  getDungCensus,
  updateDungCensus,
  deleteDungCensus,
};

export default herdController;