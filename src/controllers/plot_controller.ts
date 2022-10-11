import { RequestHandler } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { getSuccessfulDeletionMessage } from '../constants';
import { plotService } from 'services';
import { CreatePlotRequest, UpdatePlotRequest } from 'validation/plots';
import { IPlot } from 'db/models/plot';
import { BaseError } from 'errors';

const createPlot: RequestHandler = async (req: ValidatedRequest<CreatePlotRequest>, res, next) => {
  try {
    const {
      teamId,
      photoId,
      latitude,
      longitude,
      length,
      width,
      name,
    } = req.body;

    const newPlot = await plotService.createPlot({ 
      teamId,
      photoId,
      latitude,
      longitude,
      length,
      width,
      name,
    });

    res.status(201).json(newPlot);
  } catch (error) {
    next(error);
  }
};

const getPlot: RequestHandler = async (req, res, next) => {
  try {
    // Can only query on certain fields
    const id = req.query?.id as string;
    const teamId = req.query?.teamId as string;
    
    const plots : IPlot[] = await plotService.getPlots({ id, teamId });
    if (plots.length === 0) throw new BaseError('Plot not found', 404);
    else res.status(200).json(plots[0]);
  } catch (error) {
    next(error);
  }
};

const updatePlot: RequestHandler = async (req: ValidatedRequest<UpdatePlotRequest>, res, next) => {
  try {
    const {
      teamId,
      photoId,
      latitude,
      longitude,
      length,
      width,
      name,
    } = req.body;

    const updatedPlots = await plotService.editPlots(
      { teamId, photoId, latitude, longitude, length, width, name },
      { id: req.params.id },
    );

    if (updatedPlots.length === 0) throw new BaseError('Plot not found', 404);
    else res.status(200).json(updatedPlots[0]);
  } catch (error) {
    next(error);
  }
};

const deletePlot: RequestHandler = async (req, res, next) => {
  try {
    const plots : IPlot[] = await plotService.getPlots({ id: req.params.id });
    if (plots.length === 0) throw new BaseError('Plot not found', 404);
    else {
      await plotService.deletePlots({ id: req.params.id });
      res.json({ message: getSuccessfulDeletionMessage(req.params.id) });
    }
  } catch (error) {
    next(error);
  }
};

const plotController = {
  createPlot,
  getPlot,
  updatePlot,
  deletePlot,
};

export default plotController;