import { RequestHandler } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { getSuccessfulDeletionMessage } from '../constants';
import { forageQuantityCensusService } from 'services';
import { CreateForageQuantityCensusRequest, UpdateForageQuantityCensusRequest } from 'validation/forage_quantity_census';
import { IForageQuantityCensus } from 'db/models/forage_quantity_census';
import { BaseError } from 'errors';

const createForageQuantityCensus: RequestHandler = async (req: ValidatedRequest<CreateForageQuantityCensusRequest>, res, next) => {
  try {
    const {
      plotId,
      photo,
      sda,
      notes,
    } = req.body;

    const newForageQuantityCensus = await forageQuantityCensusService.createForageQuantityCensus({ 
      plotId,
      sda,
      notes,
    }, photo);

    res.status(201).json(newForageQuantityCensus);
  } catch (error) {
    next(error);
  }
};

const getForageQuantityCensuses: RequestHandler = async (req, res, next) => {
  try {
    const id = req.query?.id as string;
    const plotId = req.query?.plotId as string;
    const photoId = req.query?.photoId as string;
    const sda = Number(req.query?.sda);
    const notes = req.query?.notes as string;
    
    const forageQuantityCensuses = await forageQuantityCensusService.getForageQuantityCensuses({
      id,
      plotId,
      photoId,
      sda,
      notes,
    });
    res.status(200).json(forageQuantityCensuses);
  } catch (error) {
    next(error);
  }
};

const getForageQuantityCensus: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const plotId = req.query?.plotId as string;
    const photoId = req.query?.photoId as string;
    const sda = Number(req.query?.sda);
    const notes = req.query?.notes as string;
    
    const forageQuantityCensuses = await forageQuantityCensusService.getForageQuantityCensuses({
      id,
      plotId,
      photoId,
      sda,
      notes,
    });
    if (forageQuantityCensuses.length === 0) throw new BaseError('ForageQuantityCensus not found', 404);
    else if (forageQuantityCensuses.length > 1) throw new BaseError('Multiple ForageQuantityCensus entries found', 404);
    else res.status(200).json(forageQuantityCensuses[0]);
  } catch (error) {
    next(error);
  }
};

const updateForageQuantityCensus: RequestHandler = async (req: ValidatedRequest<UpdateForageQuantityCensusRequest>, res, next) => {
  try {
    const {
      plotId,
      photoId,
      sda,
      notes,
    } = req.body;

    const updatedForageQuantityCensuses = await forageQuantityCensusService.editForageQuantityCensuses(
      { plotId, photoId, sda, notes },
      { id: req.params.id },
    );

    if (updatedForageQuantityCensuses.length === 0) throw new BaseError('ForageQuantityCensus not found', 404);
    else res.status(200).json(updatedForageQuantityCensuses[0]);
  } catch (error) {
    next(error);
  }
};

const deleteForageQuantityCensus: RequestHandler = async (req, res, next) => {
  try {
    const forageQuantityCensuses : IForageQuantityCensus[] = await forageQuantityCensusService.getForageQuantityCensuses({ id: req.params.id });
    if (forageQuantityCensuses.length === 0) throw new BaseError('ForageQuantityCensus not found', 404);
    else {
      await forageQuantityCensusService.deleteForageQuantityCensuses({ id: req.params.id });
      res.json({ message: getSuccessfulDeletionMessage(req.params.id) });
    }
  } catch (error) {
    next(error);
  }
};

const forageQuantityCensusController = {
  createForageQuantityCensus,
  getForageQuantityCensuses,
  getForageQuantityCensus,
  updateForageQuantityCensus,
  deleteForageQuantityCensus,
};

export default forageQuantityCensusController;