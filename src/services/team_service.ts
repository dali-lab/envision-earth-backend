// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from 'uuid';
import TeamModel, { ITeam } from 'db/models/team';
import UserModel from 'db/models/user';
import { Op } from 'sequelize';
import { DatabaseQuery } from '../constants';
import { BaseError } from 'errors';
import { generateCode } from '../util';

export interface TeamParams {
  id?: string;
  userId?: string;
  
  name?: string;
  acreSize?: number;
  address?: string;
  yrsRanch?: number;
  yrsHolMang?: number;
  code?: string;

  limit?: number;
  offset?: number
}

const constructQuery = (params: TeamParams) => {
  const { id, userId, name, acreSize, address, yrsRanch, yrsHolMang, code, limit, offset } = params;
  const query: DatabaseQuery<TeamParams> = {
    where: {},
  };
  if (id) {
    query.where.id = {
      [Op.eq]: id,
    };
  }
  if (name) {
    query.where.name = {
      [Op.eq]: name,
    };
  }
  if (acreSize) {
    query.where.acreSize = {
      [Op.eq]: acreSize,
    };
  }
  if (address) {
    query.where.address = {
      [Op.eq]: address,
    };
  }
  if (yrsRanch) {
    query.where.yrsRanch = {
      [Op.eq]: yrsRanch,
    };
  }
  if (yrsHolMang) {
    query.where.yrsHolMang = {
      [Op.eq]: yrsHolMang,
    };
  }
  if (code) {
    query.where.code = {
      [Op.eq]: code,
    };
  }
  if (userId) {
    query.include = [{ model: UserModel, attributes: ['id'] }];
    query.where['$members->Membership.userId$'] = userId;
  }
  if (limit) {
    query.limit = limit;
  }
  if (offset) {
    query.offset = offset;
  }
  return query;
};

export const getTeams = async (params: TeamParams) => {
  const query = constructQuery(params);
  try {
    return await TeamModel.findAll(query);
  } catch (e : any) {
    throw new BaseError(e.message, 500);
  }
};

export const editTeams = async (team: Partial<ITeam>, params: TeamParams) => {
  const query = constructQuery(params);
  try {
    return (await TeamModel.update(team, { ...query, returning: true }))[1];
  } catch (e: any) {
    throw new BaseError(e.message, 500);
  }
};

export const deleteTeams = async (params: TeamParams) => {
  const query = constructQuery(params);
  try {
    return await TeamModel.destroy(query);
  } catch (e : any) {
    throw new BaseError(e.message, 500);
  }
};

export const createTeam = async (params: Omit<ITeam, 'id' | 'code'>) => {
  try {
    return await TeamModel.create({
      ...params,
      id: uuidv4(),
      code: generateCode(8),
    });
  } catch (e: any) {
    throw new BaseError(e.message, 500);
  }
};

const teamService = {
  createTeam,
  getTeams,
  editTeams,
  deleteTeams,
};

export default teamService;
