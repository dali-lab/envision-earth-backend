import joi from 'joi';
import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';
import { IPhoto } from 'db/models/photo';
import { IPhotoInput } from 'services/photo_service';

interface ICreatePhotoRequest {
  file: IPhotoInput
} 

export const CreatePhotoSchema = joi.object<ICreatePhotoRequest>({
  file: joi.any(), // TODO: specify
});

export interface CreatePhotoRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: ICreatePhotoRequest
}

export const UpdatePhotoSchema = joi.object<IPhoto>({
  id: joi.string(),
  fullUrl: joi.string(),
});

export interface UpdatePhotoRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Partial<IPhoto>
}