// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from 'uuid';
import ForageQualityCensusModel, { IForageQualityCensus } from 'db/models/forage_quality_census';
import { IPhoto } from 'db/models/photo';
import { Op } from 'sequelize';
import { DatabaseQuery } from '../constants';
import { BaseError } from 'errors';
import photoService, { IPhotoInput } from './photo_service';

export interface ForageQualityCensusParams {
  id?: string;
  
  plotId?: string;
  photoId?: string;
  rating?: number;
  notes?: string;

  offset?: number;
  limit?: number;
}

const constructQuery = (params: ForageQualityCensusParams) => {
  const { id, plotId, photoId, rating, notes, offset, limit } = params;
  const query: DatabaseQuery<ForageQualityCensusParams> = {
    where: {},
  };
  if (id) {
    query.where.id = {
      [Op.eq]: id,
    };
  }
  if (plotId) {
    query.where.plotId = {
      [Op.eq]: plotId,
    };
  }
  if (photoId) {
    query.where.photoId = {
      [Op.eq]: photoId,
    };
  }
  if (rating) {
    query.where.rating = {
      [Op.eq]: rating,
    };
  }
  if (notes) {
    query.where.notes = {
      [Op.eq]: notes,
    };
  }
  if (limit) {
    query.limit = limit;
  }
  if (offset) {
    query.offset = offset;
  }
  return query;
};

export const getForageQualityCensuses = async (params: ForageQualityCensusParams) => {
  const query = constructQuery(params);
  try {
    return await ForageQualityCensusModel.findAll(query);
  } catch (e : any) {
    throw new BaseError(e.message, 500);
  }
};

export const editForageQualityCensuses = async (forageQualityCensus: Partial<IForageQualityCensus>, params: ForageQualityCensusParams) => {
  const query = constructQuery(params);

  try {
    return (await ForageQualityCensusModel.update(forageQualityCensus, { ...query, returning: true }))[1];
  } catch (e: any) {
    throw new BaseError(e.message, 500);
  }
};

export const deleteForageQualityCensuses = async (params: ForageQualityCensusParams) => {
  const query = constructQuery(params);
  try {
    return await ForageQualityCensusModel.destroy(query);
  } catch (e : any) {
    throw new BaseError(e.message, 500);
  }
};

export const createForageQualityCensus = async (params: Omit<IForageQualityCensus, 'id' | 'photoId'>, file?: IPhotoInput) => {
  try {
    if (file) {
      const photo: IPhoto = await photoService.createPhoto(file);
      return await ForageQualityCensusModel.create({
        ...params,
        id: uuidv4(),
        photoId: photo.id,
      });
    } else {
      return await ForageQualityCensusModel.create({
        ...params,
        id: uuidv4(),
        photoId: null,
      });
    }
  } catch (e: any) {
    console.log(e);
    throw new BaseError(e.message, 500);
  }
};

const forageQualityCensusService = {
  createForageQualityCensus,
  getForageQualityCensuses,
  editForageQualityCensuses,
  deleteForageQualityCensuses,
};

export default forageQualityCensusService;