import { RequestHandler } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { getSuccessfulDeletionMessage } from '../constants';
import { herdService } from 'services';
import { CreateHerdRequest, UpdateHerdRequest } from 'validation/herds';
import { IHerd } from 'db/models/herd';
import { BaseError } from 'errors';

const createHerd: RequestHandler = async (req: ValidatedRequest<CreateHerdRequest>, res, next) => {
  try {
    const {
      teamId,
      species,
      count,
      breedingDate,
      calvingDate,
    } = req.body;

    const newHerd = await herdService.createHerd({ 
      teamId,
      species,
      count,
      breedingDate,
      calvingDate,
    });

    res.status(201).json(newHerd);
  } catch (error) {
    next(error);
  }
};

const getHerd: RequestHandler = async (req, res, next) => {
  try {
    const herds : IHerd[] = await herdService.getHerds({ id: req.params.id });
    if (herds.length === 0) throw new BaseError('Herd not found', 404);
    else res.status(200).json(herds[0]);
  } catch (error) {
    next(error);
  }
};

const updateHerd: RequestHandler = async (req: ValidatedRequest<UpdateHerdRequest>, res, next) => {
  try {
    const {
      teamId,
      species,
      count,
      breedingDate,
      calvingDate,
    } = req.body;

    const updatedHerds = await herdService.editHerds(
      { teamId, species, count, breedingDate, calvingDate },
      { id: req.params.id },
    );

    if (updatedHerds.length === 0) throw new BaseError('Herd not found', 404);
    else res.status(200).json(updatedHerds[0]);
  } catch (error) {
    next(error);
  }
};

const deleteHerd: RequestHandler = async (req, res, next) => {
  try {
    const herds : IHerd[] = await herdService.getHerds({ id: req.params.id });
    if (herds.length === 0) throw new BaseError('Herd not found', 404);
    else {
      await herdService.deleteHerds({ id: req.params.id });
      res.json({ message: getSuccessfulDeletionMessage(req.params.id) });
    }
  } catch (error) {
    next(error);
  }
};

const herdController = {
  createHerd,
  getHerd,
  updateHerd,
  deleteHerd,
};

export default herdController;