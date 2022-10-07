import joi from 'joi';
import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';
import { CreatePhotoRequestSchema, UpdatePhotoRequestSchema } from 'services/photo_service';
// Network request schema

export interface CreatePhotoRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: CreatePhotoRequestSchema
}

export interface UpdatePhotoRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: UpdatePhotoRequestSchema
}

export const CreatePhotoSchema = joi.object<CreatePhotoRequestSchema>({
  // Image represented as binary?
  // May also need to consider the size limits of the binary
  file: joi.binary().required().error(() => 'Create Photo expecting a photo file'),
});

export const UpdatePhotoSchema = joi.object<UpdatePhotoRequestSchema>({
  // fullUrl: joi.strin().required().error(() => 'Create Photo expecting a URL'),
  link: joi.string().required().error(() => 'Update Photo expecting a photo link to update'),
  file: joi.binary().required().error(() => 'Update Photo expecting a photo file'),
});
