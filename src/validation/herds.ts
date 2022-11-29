import joi from 'joi';
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';
import { IHerd } from 'db/models/herd';

export const CreateHerdSchema = joi.object<Omit<IHerd, 'id' | 'role'>>({
  teamId: joi.string().required().error(() => new Error('Create herd expecting a teamId')),
  breed: joi.string().required().error(() => new Error('Create herd expecting a breed')),
  count: joi.number().required().error(() => new Error('Create herd expecting a count')),
  breedingDate: joi.date().required().error(() => new Error('Create herd expecting a breedingDate')),
  calvingDate: joi.date().required().error(() => new Error('Create herd expecting a calvingDate')),
});

export interface CreateHerdRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: IHerd
}

export const UpdateHerdSchema = joi.object<IHerd>({
  id: joi.string(),
  teamId: joi.string(),
  breed: joi.string(),
  count: joi.number(),
  breedingDate: joi.date(),
  calvingDate: joi.date(),
});

export interface UpdateHerdRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Partial<IHerd>
}
