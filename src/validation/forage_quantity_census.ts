import joi from 'joi';
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';
import { IForageQuantityCensus } from 'db/models/forage_quantity_census';
import { IPhotoInput } from '../services/photo_service';

interface ICreateForageQuantityCensusRequest {
  plotId: string;
  photo?: IPhotoInput;
  sda: number,
  notes: string;
}

export const CreateForageQuantityCensusSchema = joi.object<ICreateForageQuantityCensusRequest>({
  plotId: joi.string().required().error(() => new Error('Create ForageQuantityCensus expecting a plotId')),
  sda: joi.number().required().error(() => new Error('Create ForageQuantityCensus expecting a sda')),
  notes: joi.string().required().error(() => new Error('Create ForageQuantityCensus expecting a notes')),
  photo: joi.any(), // TODO: specify
});

export interface CreateForageQuantityCensusRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: ICreateForageQuantityCensusRequest
}

export const UpdateForageQuantityCensusSchema = joi.object<IForageQuantityCensus>({
  id: joi.string(),
  plotId: joi.string(),
  photoId: joi.string().allow(null),
  sda: joi.number(),
  notes: joi.string(),
});

export interface UpdateForageQuantityCensusRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Partial<IForageQuantityCensus>
}
