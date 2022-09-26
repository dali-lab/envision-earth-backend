// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from 'uuid';
import HerdModel, { IHerd } from 'db/models/herd';
import { Op } from 'sequelize';
import { DatabaseQuery } from '../constants';
import { BaseError } from 'errors';

export interface HerdParams {
  id?: string;

  teamId?: string;
  breed?: string;
  count?: number,
  breedingDate?: Date,
  calvingDate?: Date,

  offset?: number;
  limit?: number;
}

const constructQuery = (params: HerdParams) => {
  const { id, teamId, breed, count, breedingDate, calvingDate, offset, limit } = params;
  const query: DatabaseQuery<HerdParams> = {
    where: {},
  };
  if (id) {
    query.where.id = {
      [Op.eq]: id,
    };
  }
  if (teamId) {
    query.where.teamId = {
      [Op.eq]: teamId,
    };
  }
  if (breed) {
    query.where.breed = {
      [Op.eq]: breed,
    };
  }
  if (count) {
    query.where.count = {
      [Op.eq]: count,
    };
  }
  if (breedingDate) {
    query.where.breedingDate = {
      [Op.eq]: breedingDate,
    };
  }
  if (calvingDate) {
    query.where.calvingDate = {
      [Op.eq]: calvingDate,
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

export const getHerds = async (params: HerdParams) => {
  const query = constructQuery(params);
  try {
    return await HerdModel.findAll(query);
  } catch (e : any) {
    throw new BaseError(e.message, 500);
  }
};

export const editHerds = async (herd: Partial<IHerd>, params: HerdParams) => {
  const query = constructQuery(params);
  try {
    return (await HerdModel.update(herd, { ...query, returning: true }))[1];
  } catch (e: any) {
    throw new BaseError(e.message, 500);
  }
};

export const deleteHerds = async (params: HerdParams) => {
  const query = constructQuery(params);
  try {
    return await HerdModel.destroy(query);
  } catch (e : any) {
    throw new BaseError(e.message, 500);
  }
};

export const createHerd = async (params: Omit<IHerd, 'id'>) => {
  try {
    return await HerdModel.create({
      ...params,
      id: uuidv4(),
    });
  } catch (e: any) {
    throw new BaseError(e.message, 500);
  }
};

const herdService = {
  createHerd,
  getHerds,
  editHerds,
  deleteHerds,
};

export default herdService;
