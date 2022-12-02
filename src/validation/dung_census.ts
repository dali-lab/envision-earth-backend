import joi from 'joi';
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';
import { IDungCensus } from 'db/models/dung_census';
import { IPhotoInput } from '../services/photo_service';

export interface ICreateDungCensusRequest {
  herdId: string;
  plotId: string;
  photo?: IPhotoInput;
  ratings: number[],
  notes: string;
}

export const CreateDungCensusSchema = joi.object<ICreateDungCensusRequest>({
  herdId: joi.string().required().error(() => new Error('Create dung census expecting a herdId')),
  plotId: joi.string().required().error(() => new Error('Create dung census expecting a plotId')),
  photo: joi.any(), // TODO: specify
  ratings: joi.array().items(joi.number().required().error(() => new Error('Need array of numbers')).required().error(() => new Error('Create dung census expecting arr. of ratings'))),
  notes: joi.string().required().error(() => new Error('Create dung census expecting notes')),
});

export interface CreateDungCensusRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: ICreateDungCensusRequest
}

export const UpdateDungCensusSchema = joi.object<IDungCensus>({
  id: joi.string(),
  herdId: joi.string(),
  plotId: joi.string(),
  photoId: joi.string().allow(null),
  ratings: joi.array().items(joi.number().required().error(() => 'Ratings needs array of numbers')),
  notes: joi.string(),
});

export interface UpdateDungCensusRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Partial<IDungCensus>
}