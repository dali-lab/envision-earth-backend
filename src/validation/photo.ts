import joi from 'joi';
import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';
import { IPhoto } from 'db/models/photo';

export interface CreatePhotoRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: IPhoto
}

export interface UpdatePhotoRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Partial<IPhoto>
}

export const CreatePhotoSchema = joi.object<IPhoto>({
  fullUrl: joi.string().required().error(() => 'Create Photo expectin a URL'),
});

export const UpdatePhotoSchema = joi.object<IPhoto>({
  // fullUrl: joi.strin().required().error(() => 'Create Photo expecting a URL'),
  id: joi.string().error(() => 'Update Photo expecting an ID'),
  fullUrl: joi.string().error(() => 'Update Photo expecting a link'),
});
