// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from 'uuid';
import DungCensusModel, { IDungCensus } from 'db/models/dung_census';
import { IPhoto } from 'db/models/photo';
import { Op } from 'sequelize';
import { DatabaseQuery } from '../constants';
import { BaseError } from 'errors';
import photoService, { IPhotoInput } from './photo_service';

export interface DungCensusParams {
  id?: string;

  herdId?: string;
  plotId?: string;
  photoId?: string;
  ratings?: number[],
  notes?: string;

  offset?: number;
  limit?: number;
}

const constructQuery = (params: DungCensusParams) => {
  const { id, herdId, plotId, photoId, ratings, notes, offset, limit } = params;
  const query: DatabaseQuery<DungCensusParams> = {
    where: {},
  };
  if (id) {
    query.where.id = {
      [Op.eq]: id,
    };
  }
  if (herdId) {
    query.where.herdId = {
      [Op.eq]: herdId,
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
  if (ratings) {  // TODO: Fix this
    query.where.ratings = {
      [Op.eq]: JSON.stringify(ratings).replace('[', '{').replace(']', '}'),
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

export const getDungCensuses = async (params: DungCensusParams) => {
  const query = constructQuery(params);
  
  try {
    return await DungCensusModel.findAll(query);
  } catch (e : any) {
    throw new BaseError(e.message, 500);
  }
};

export const editDungCensuses = async (dungCensus: Partial<IDungCensus>, params: DungCensusParams) => {
  const query = constructQuery(params);
  if (dungCensus.ratings) {
    dungCensus.ratings = JSON.stringify(dungCensus.ratings).replace('[', '{').replace(']', '}');
  }

  try {
    return (await DungCensusModel.update(dungCensus, { ...query, returning: true }))[1];
  } catch (e: any) {
    throw new BaseError(e.message, 500);
  }
};

export const deleteDungCensuses = async (params: DungCensusParams) => {
  const query = constructQuery(params);
  try {
    return await DungCensusModel.destroy(query);
  } catch (e : any) {
    throw new BaseError(e.message, 500);
  }
};

export const createDungCensus = async (params: Omit<IDungCensus, 'id' | 'photoId'>, file?: IPhotoInput) => {
  try {
    // This stringify conversion fixes "malformed array literal" error
    const ratings = JSON.stringify(params.ratings).replace('[', '{').replace(']', '}');
    if (file) {
      const photo: IPhoto = await photoService.createPhoto(file);
    
      return await DungCensusModel.create({
        ...params,
        id: uuidv4(),
        ratings: ratings,
        photoId: photo.id,
      });
    } else {
      return await DungCensusModel.create({
        ...params,
        id: uuidv4(),
        ratings: ratings,
        photoId: null,
      });
    }
  } catch (e: any) {
    throw new BaseError(e.message, 500);
  }
};

const dungCensusService = {
  createDungCensus,
  getDungCensuses,
  editDungCensuses,
  deleteDungCensuses,
};

export default dungCensusService;