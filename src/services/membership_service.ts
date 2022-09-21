// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from 'uuid';
import { TeamScopes } from 'db/models/team';
import MembershipModel, { IMembership } from 'db/models/membership';
import { Op } from 'sequelize';
import { DatabaseQuery } from '../constants';
import { BaseError } from 'errors';

export interface MembershipParams {
  id?: string;

  teamId?: string;
  userId?: string;

  role?: TeamScopes;

  offset?: number;
  limit?: number;
}

const constructQuery = (params: MembershipParams) => {
  const { id, teamId, userId, role, offset, limit } = params;
  const query: DatabaseQuery<MembershipParams> = {
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
  if (userId) {
    query.where.userId = {
      [Op.eq]: userId,
    };
  }
  if (role) {
    query.where.role = {
      [Op.eq]: role,
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

export const getMemberships = async (params: MembershipParams) => {
  const query = constructQuery(params);
  try {
    return await MembershipModel.findAll(query);
  } catch (e : any) {
    throw new BaseError(e.message, 500);
  }
};

export const editMemberships = async (membership: Partial<IMembership>, params: MembershipParams) => {
  const query = constructQuery(params);
  try {
    return (await MembershipModel.update(membership, { ...query, returning: true }))[1];
  } catch (e: any) {
    throw new BaseError(e.message, 500);
  }
};

export const deleteMemberships = async (params: MembershipParams) => {
  const query = constructQuery(params);
  try {
    return await MembershipModel.destroy(query);
  } catch (e : any) {
    throw new BaseError(e.message, 500);
  }
};

export const createMembership = async (params: Omit<IMembership, 'id'>) => {
  /*
  // Does user exist?
  const users = await getUsers({ id: params.userId });

  // no user with this email exists. create inactive user account
  if (users.length == 0) {
    users.push(await createInactiveAccount(membership.email));
  }

  // existing user was inactive or new inactive user was created. invite them
  // if (!users[0].active) await emailInvitation(membership);
  */

  try {
    return await MembershipModel.create({
      ...params,
      id: uuidv4(),
    });
  } catch (e: any) {
    throw new BaseError(e.message, 500);
  }
};

const membershipService = {
  createMembership,
  getMemberships,
  editMemberships,
  deleteMemberships,
};

export default membershipService;
