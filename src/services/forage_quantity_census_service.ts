// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from 'uuid';
import ForageQuantityCensusModel, { IForageQuantityCensus } from 'db/models/forage_quantity_census';
import { IPhoto } from 'db/models/photo';
import { Op } from 'sequelize';
import { DatabaseQuery } from '../constants';
import { BaseError } from 'errors';
import photoService, { IPhotoInput } from './photo_service';

export interface ForageQuantityCensusParams {
  id?: string;
  
  plotId?: string;
  photoId?: string;
  sda?: number;
  notes?: string;

  offset?: number;
  limit?: number;
}

const constructQuery = (params: ForageQuantityCensusParams) => {
  const { id, plotId, photoId, sda, notes, offset, limit } = params;
  const query: DatabaseQuery<ForageQuantityCensusParams> = {
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
  if (sda) {
    query.where.sda = {
      [Op.eq]: sda,
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

export const getForageQuantityCensuses = async (params: ForageQuantityCensusParams) => {
  const query = constructQuery(params);
  try {
    return await ForageQuantityCensusModel.findAll(query);
  } catch (e : any) {
    throw new BaseError(e.message, 500);
  }
};

export const editForageQuantityCensuses = async (forageQuantityCensus: Partial<IForageQuantityCensus>, params: ForageQuantityCensusParams) => {
  const query = constructQuery(params);

  try {
    return (await ForageQuantityCensusModel.update(forageQuantityCensus, { ...query, returning: true }))[1];
  } catch (e: any) {
    throw new BaseError(e.message, 500);
  }
};

export const deleteForageQuantityCensuses = async (params: ForageQuantityCensusParams) => {
  const query = constructQuery(params);
  try {
    return await ForageQuantityCensusModel.destroy(query);
  } catch (e : any) {
    throw new BaseError(e.message, 500);
  }
};

export const createForageQuantityCensus = async (params: Omit<IForageQuantityCensus, 'id' | 'photoId'>, file?: IPhotoInput) => {
  try {
    if (file) {
      const photo: IPhoto = await photoService.createPhoto(file);
      return await ForageQuantityCensusModel.create({
        ...params,
        id: uuidv4(),
        photoId: photo.id,
      });
    } else {
      return await ForageQuantityCensusModel.create({
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

const forageQuantityCensusService = {
  createForageQuantityCensus,
  getForageQuantityCensuses,
  editForageQuantityCensuses,
  deleteForageQuantityCensuses,
};

export default forageQuantityCensusService;