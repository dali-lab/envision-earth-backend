import joi from 'joi';
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';
import { ICowCensus } from 'db/models/cow_census';
import { IPhotoInput } from '../services/photo_service';

interface ICreateCowCensusRequest {
  herdId: string;
  plotId: string;
  bcs: number[],
  notes: string;
  tag: string;
  photo?: IPhotoInput;
}

export const CreateCowCensusSchema = joi.object<ICreateCowCensusRequest>({
  herdId: joi.string().required().error(() => 'Create cow census expecting a herdId'),
  plotId: joi.string().required().error(() => 'Create cow census expecting a plotId'),
  bcs: joi.array().items(joi.number().required().error(() => 'Need array of numbers')).required().error(() => 'Create cow census expecting arr. of ratings'),
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
  plotId: joi.string(),
  photoId: joi.string().allow(null),
  bcs: joi.array().items(joi.number().required().error(() => 'BCS needs array of numbers')),
  notes: joi.string(),
  tag: joi.string(),
});

export interface UpdateCowCensusRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Partial<ICowCensus>
}