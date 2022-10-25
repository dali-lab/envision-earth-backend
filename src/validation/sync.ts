import joi from 'joi';
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';
import { ICreateCowCensusRequest } from './cow_census';

interface SyncData {
  upserted: {
    cowCensusRequests: ICreateCowCensusRequest[],
  };
}

export const CreateSyncSchema = joi.object<SyncData>({
  upserted: joi.any(), // TODO: Specify
});

export interface CreateSyncRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: SyncData
}