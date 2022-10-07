// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from 'uuid';
import CowCensusModel, { ICowCensus } from 'db/models/cow_census';
import { IPhoto } from 'db/models/photo';
import { Op } from 'sequelize';
import { DatabaseQuery } from '../constants';
import { BaseError } from 'errors';
import photoService, { IPhotoInput } from './photo_service';

export interface CowCensusParams {
  id?: string;

  herdId?: string;
  photoId?: string;
  bcs?: number,
  notes?: string;
  tag?: string;

  offset?: number;
  limit?: number;
}

const constructQuery = (params: CowCensusParams) => {
  const { id, herdId, photoId, bcs, notes, tag, offset, limit } = params;
  const query: DatabaseQuery<CowCensusParams> = {
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
  if (photoId) {
    query.where.photoId = {
      [Op.eq]: photoId,
    };
  }
  if (bcs) {
    query.where.bcs = {
      [Op.eq]: bcs,
    };
  }
  if (notes) {
    query.where.notes = {
      [Op.eq]: notes,
    };
  }
  if (tag) {
    query.where.tag = {
      [Op.eq]: tag,
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

export const getCowCensuses = async (params: CowCensusParams) => {
  const query = constructQuery(params);
  try {
    return await CowCensusModel.findAll(query);
  } catch (e : any) {
    throw new BaseError(e.message, 500);
  }
};

export const editCowCensuses = async (herd: Partial<ICowCensus>, params: CowCensusParams) => {
  const query = constructQuery(params);
  try {
    return (await CowCensusModel.update(herd, { ...query, returning: true }))[1];
  } catch (e: any) {
    throw new BaseError(e.message, 500);
  }
};

export const deleteCowCensuses = async (params: CowCensusParams) => {
  const query = constructQuery(params);
  try {
    return await CowCensusModel.destroy(query);
  } catch (e : any) {
    throw new BaseError(e.message, 500);
  }
};

export const createCowCensus = async (params: Omit<ICowCensus, 'id' | 'photoId'>, file?: IPhotoInput) => {
  try {
    if (file) {
      const id = uuidv4();
      const photo: IPhoto = await photoService.createPhoto(file, id + '.jpg');
      return await CowCensusModel.create({
        ...params,
        id,
        photoId: photo.id,
      });
    } else {
      return await CowCensusModel.create({
        ...params,
        id: uuidv4(),
        photoId: null,
      });
    }
  } catch (e: any) {
    throw new BaseError(e.message, 500);
  }
};

const herdService = {
  createCowCensus,
  getCowCensuses,
  editCowCensuses,
  deleteCowCensuses,
};

export default herdService;