import joi from 'joi';
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';
import { IMembership } from 'db/models/membership';

export const CreateMembershipSchema = joi.object<Omit<IMembership, 'id' | 'role'>>({
  teamId: joi.string().required().error(() => 'Create membership expecting a teamId'),
  userId: joi.string().required().error(() => 'Create membership expecting a userId'),
});

export interface CreateMembershipRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: IMembership
}

export const UpdateMembershipSchema = joi.object<IMembership>({
  id: joi.string(),
  teamId: joi.string(),
  userId: joi.string(),
  role: joi.string(),
});

export interface UpdateMembershipRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Partial<IMembership>
}
