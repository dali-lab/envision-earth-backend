import joi from 'joi';
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';
import { IForageQualityCensus } from 'db/models/forage_quality_census';
import { IPhotoInput } from '../services/photo_service';

export interface ICreateForageQualityCensusRequest {
  plotId: string;
  photo?: IPhotoInput;
  rating: number,
  notes: string;
}

export const CreateForageQualityCensusSchema = joi.object<ICreateForageQualityCensusRequest>({
  plotId: joi.string().required().error(() => new Error('Create ForageQualityCensus expecting a plotId')),
  rating: joi.number().required().error(() => new Error('Create ForageQualityCensus expecting a rating')),
  notes: joi.string().required().error(() => new Error('Create ForageQualityCensus expecting a notes')),
  photo: joi.any(), // TODO: specify
});

export interface CreateForageQualityCensusRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: ICreateForageQualityCensusRequest
}

export const UpdateForageQualityCensusSchema = joi.object<IForageQualityCensus>({
  id: joi.string(),
  plotId: joi.string(),
  photoId: joi.string().allow(null),
  rating: joi.number(),
  notes: joi.string(),
});

export interface UpdateForageQualityCensusRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Partial<IForageQualityCensus>
}
