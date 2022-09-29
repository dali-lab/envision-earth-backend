import { RequestHandler } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { getSuccessfulDeletionMessage } from '../constants';
import { teamService } from 'services';
import { CreateUserRequest, UpdateUserRequest } from 'validation/users';
import { ITeam } from 'db/models/team';
import { BaseError } from 'errors';

const createNewTeam: RequestHandler = async (req: ValidatedRequest<CreateUserRequest>, res, next) => {
  try {
    const {
      name, 
    } = req.body;

    const newTeam = await teamService.createTeam({ name });

    res.status(201).json(newTeam);
  } catch (error) {
    next(error);
  }
};

const getTeam: RequestHandler = async (req, res, next) => {
  try {
    const teams : ITeam[] = await teamService.getTeams({ id: req.params.id });
    if (teams.length === 0) throw new BaseError('Team not found', 404);
    else res.status(200).json(teams[0]);
  } catch (error) {
    next(error);
  }
};

const updateTeam: RequestHandler = async (req: ValidatedRequest<UpdateUserRequest>, res, next) => {
  try {
    // ! Only allow user to update certain fields (avoids privilege elevation)
    const { name } = req.body;

    const updatedTeams = await teamService.editTeams(
      { name },
      { id: req.params.id },
    );

    if (updatedTeams.length === 0) throw new BaseError('Team not found', 404);
    else res.status(200).json(updatedTeams[0]);
  } catch (error) {
    next(error);
  }
};

const deleteTeam: RequestHandler = async (req, res, next) => {
  try {
    const teams : ITeam[] = await teamService.getTeams({ id: req.params.id });
    if (teams.length === 0) throw new BaseError('Team not found', 404);
    else {
      await teamService.deleteTeams({ id: req.params.id });
      res.json({ message: getSuccessfulDeletionMessage(req.params.id) });
    }
  } catch (error) {
    next(error);
  }
};

const membershipController = {
  createNewTeam,
  getTeam,
  updateTeam,
  deleteTeam,
};

export default membershipController;