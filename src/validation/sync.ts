import joi from 'joi';
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';
import { ICreateCowCensusRequest } from './cow_census';
import { ICreateDungCensusRequest } from './dung_census';
import { ICreateForageQualityCensusRequest } from './forage_quality_census';
import { ICreateForageQuantityCensusRequest } from './forage_quantity_census';

interface SyncData {
  upserted: {
    cowCensusRequests: ICreateCowCensusRequest[],
    dungCensusRequests: ICreateDungCensusRequest[],
    forageQualityCensusRequests: ICreateForageQualityCensusRequest[],
    forageQuantityCensusRequests: ICreateForageQuantityCensusRequest[],
  };
}

export const CreateSyncSchema = joi.object<SyncData>({
  upserted: joi.any(), // TODO: Specify
});

export interface CreateSyncRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: SyncData
}