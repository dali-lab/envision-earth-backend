// // import joi from 'joi';
// import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';
// import { IPhoto } from '../db/models/photo';

// export interface CreatePhotoRequest extends ValidatedRequestSchema {
//   [ContainerTypes.Body]: IPhoto
// }

// export interface UpdatePhotoRequest extends ValidatedRequestSchema {
//   [ContainerTypes.Body]: Partial<IPhoto>
// }

import joi from 'joi';
import { ContainerTypes, ValidatedRequest, ValidatedRequestSchema } from 'express-joi-validation'

interface PhotoRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {

  },
}
