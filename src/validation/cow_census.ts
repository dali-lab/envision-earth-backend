import joi from 'joi';
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';
import { ICowCensus } from 'db/models/cow_census';

export const CreateCowCensusSchema = joi.object<Omit<ICowCensus, 'id'>>({
  herdId: joi.string().required().error(() => 'Create cow census expecting a herdId'),
  photoId: joi.string().required().error(() => 'Create cow census expecting a photoId'),
  bcs: joi.number().required().error(() => 'Create cow census expecting a bcs'),
  notes: joi.string().required().error(() => 'Create cow census expecting a notes'),
  tag: joi.string().required().error(() => 'Create cow census expecting a tag'),
});

export interface CreateCowCensusRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: ICowCensus
}

export const UpdateCowCensusSchema = joi.object<ICowCensus>({
  id: joi.string(),
  herdId: joi.string(),
  photoId: joi.string(),
  bcs: joi.number(),
  notes: joi.string(),
  tag: joi.string(),
});

export interface UpdateCowCensusRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Partial<ICowCensus>
}