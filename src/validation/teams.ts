import joi from 'joi';
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';
import { ITeam } from '../db/models/team';

export const CreateTeamSchema = joi.object<ITeam>({
  name: joi.string().required().error(() => 'Create user expecting a name'),
});

export interface CreateUserRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: ITeam
}

export const UpdateTeamSchema = joi.object<ITeam>({
  id: joi.string(),
  name: joi.string(),
});

export interface UpdateUserRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Partial<ITeam>
}
