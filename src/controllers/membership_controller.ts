import { RequestHandler } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { getSuccessfulDeletionMessage } from '../constants';
import { membershipService } from 'services';
import { CreateMembershipRequest, UpdateMembershipRequest } from 'validation/memberships';
import { IMembership } from 'db/models/membership';
import { BaseError } from 'errors';
import { TeamScopes } from 'db/models/team';

const createMembership: RequestHandler = async (req: ValidatedRequest<CreateMembershipRequest>, res, next) => {
  try {
    const {
      teamId,
      userId,
    } = req.body;

    const newMembership = await membershipService.createMembership({ 
      teamId,
      userId,
      role: TeamScopes.User, // default
    });

    res.status(201).json(newMembership);
  } catch (error) {
    console.info(error);
    next(error);
  }
};

const getMembership: RequestHandler = async (req, res, next) => {
  try {
    const memberships : IMembership[] = await membershipService.getMemberships({ id: req.params.id });
    if (memberships.length === 0) throw new BaseError('Membership not found', 404);
    else res.status(200).json(memberships[0]);
  } catch (error) {
    next(error);
  }
};

const updateMembership: RequestHandler = async (req: ValidatedRequest<UpdateMembershipRequest>, res, next) => {
  try {
    const { teamId, userId, role } = req.body;

    const updatedMemberships = await membershipService.editMemberships(
      { teamId, userId, role },
      { id: req.params.id },
    );

    if (updatedMemberships.length === 0) throw new BaseError('Membership not found', 404);
    else res.status(200).json(updatedMemberships[0]);
  } catch (error) {
    next(error);
  }
};

const deleteMembership: RequestHandler = async (req, res, next) => {
  try {
    const memberships : IMembership[] = await membershipService.getMemberships({ id: req.params.id });
    if (memberships.length === 0) throw new BaseError('Membership not found', 404);
    else {
      await membershipService.deleteMemberships({ id: req.params.id });
      res.json({ message: getSuccessfulDeletionMessage(req.params.id) });
    }
  } catch (error) {
    next(error);
  }
};

const membershipController = {
  createMembership,
  getMembership,
  updateMembership,
  deleteMembership,
};

export default membershipController;