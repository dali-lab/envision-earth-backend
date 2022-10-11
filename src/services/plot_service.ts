// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from 'uuid';
import PlotModel, { IPlot } from 'db/models/plot';
import { Op } from 'sequelize';
import { DatabaseQuery } from '../constants';
import { BaseError } from 'errors';

export interface PlotParams {
  id?: string;

  teamId?: string;
  photoId?: string;
  latitude?: number;
  longitude?: number;
  length?: number;
  width?: number;
  name?: string;

  offset?: number;
  limit?: number;
}

const constructQuery = (params: PlotParams) => {
  const { 
    id, 
    teamId, 
    photoId, 
    latitude, 
    longitude, 
    length, 
    width, 
    name, 
    offset, 
    limit,
  } = params;
  const query: DatabaseQuery<PlotParams> = {
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
  if (photoId) {
    query.where.photoId = {
      [Op.eq]: photoId,
    };
  }
  if (latitude) {
    query.where.latitude = {
      [Op.eq]: latitude,
    };
  }
  if (longitude) {
    query.where.longitude = {
      [Op.eq]: longitude,
    };
  }
  if (length) {
    query.where.length = {
      [Op.eq]: length,
    };
  }
  if (width) {
    query.where.width = {
      [Op.eq]: width,
    };
  }
  if (name) {
    query.where.name = {
      [Op.eq]: name,
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

export const getPlots = async (params: PlotParams) => {
  const query = constructQuery(params);
  try {
    return await PlotModel.findAll(query);
  } catch (e : any) {
    throw new BaseError(e.message, 500);
  }
};

export const editPlots = async (plot: Partial<IPlot>, params: PlotParams) => {
  const query = constructQuery(params);
  try {
    return (await PlotModel.update(plot, { ...query, returning: true }))[1];
  } catch (e: any) {
    throw new BaseError(e.message, 500);
  }
};

export const deletePlots = async (params: PlotParams) => {
  const query = constructQuery(params);
  try {
    return await PlotModel.destroy(query);
  } catch (e : any) {
    throw new BaseError(e.message, 500);
  }
};

export const createPlot = async (params: Omit<IPlot, 'id'>) => {
  try {
    return await PlotModel.create({
      ...params,
      id: uuidv4(),
    });
  } catch (e: any) {
    throw new BaseError(e.message, 500);
  }
};

const plotService = {
  createPlot,
  getPlots,
  editPlots,
  deletePlots,
};

export default plotService;