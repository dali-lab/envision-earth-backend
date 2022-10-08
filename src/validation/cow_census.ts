import joi from 'joi';
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';
import { ICowCensus } from 'db/models/cow_census';
import { IPhotoInput } from '../services/photo_service';

interface ICreateCowCensusRequest {
  herdId: string;
  bcs: number,
  notes: string;
  tag: string;
  photo?: IPhotoInput;
}

export const CreateCowCensusSchema = joi.object<ICreateCowCensusRequest>({
  herdId: joi.string().required().error(() => 'Create cow census expecting a herdId'),
  bcs: joi.number().required().error(() => 'Create cow census expecting a bcs'),
  notes: joi.string().required().error(() => 'Create cow census expecting a notes'),
  tag: joi.string().required().error(() => 'Create cow census expecting a tag'),
  photo: joi.any(), // TODO: specify
});

export interface CreateCowCensusRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: ICreateCowCensusRequest
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