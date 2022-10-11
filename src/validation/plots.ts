import joi from 'joi';
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';
import { IPlot } from 'db/models/plot';

export const CreatePlotSchema = joi.object<Omit<IPlot, 'id'>>({
  teamId: joi.string().required().error(() => 'Create plot expecting a teamId'),
  photoId: joi.string().required().error(() => 'Create plot expecting a photoId'),
  latitude: joi.number().required().error(() => 'Create plot expecting a latitude'),
  longitude: joi.number().required().error(() => 'Create plot expecting a longitude'),
  length: joi.number().required().error(() => 'Create plot expecting a length'),
  width: joi.number().required().error(() => 'Create plot expecting a width'),
  name: joi.string().required().error(() => 'Create plot expecting a name'),
});

export interface CreatePlotRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: IPlot
}

export const UpdatePlotSchema = joi.object<IPlot>({
  id: joi.string(),
  teamId: joi.string(),
  photoId: joi.string(),
  latitude: joi.number(),
  longitude: joi.number(),
  length: joi.number(),
  width: joi.number(),
  name: joi.string(),
});

export interface UpdatePlotRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Partial<IPlot>
}
