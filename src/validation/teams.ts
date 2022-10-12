import joi from 'joi';
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';
import { ITeam } from '../db/models/team';

export const CreateTeamSchema = joi.object<Omit<ITeam, 'id' | 'code'>>({
  name: joi.string().required().error(() => 'Create team expecting a name'),
  acreSize: joi.number().required().error(() => 'Create team expecting an acreSize'),
  address: joi.string().required().error(() => 'Create team expecting an address'),
  yrsRanch: joi.number().required().error(() => 'Create team expecting a yrsRanch'),
  yrsHolMang: joi.number().required().error(() => 'Create team expecting a yrsHolMang'),
});

export interface CreateTeamRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: ITeam
}

export const UpdateTeamSchema = joi.object<ITeam>({
  id: joi.string(),
  name: joi.string(),
  acreSize: joi.number(),
  address: joi.string(),
  yrsRanch: joi.number(),
  yrsHolMang: joi.number(),
  code: joi.string(),
});

export interface UpdateTeamRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Partial<ITeam>
}
