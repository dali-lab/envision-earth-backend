import { TeamScopes } from '../db/models/team';

interface ITeamScope {
  name: TeamScopes,
  subscopes: Set<TeamScopes>
}

const OwnerScope: ITeamScope = {
  name: TeamScopes.Owner,
  subscopes: new Set<TeamScopes>([TeamScopes.User, TeamScopes.Contributor]),
};

const ContributorScope: ITeamScope = {
  name: TeamScopes.Contributor,
  subscopes: new Set<TeamScopes>([TeamScopes.User, TeamScopes.Contributor]),
};

const UserScope: ITeamScope = {
  name: TeamScopes.User,
  subscopes: new Set([]),
};

export const SCOPES: Record<TeamScopes, ITeamScope> = {
  USER: UserScope,
  CONTRIBUTOR: ContributorScope,
  OWNER: OwnerScope,
};

/**
 * A function that checks if s2 is a subscope of s1
 * @param s1 scope that is potentially the parent scope
 * @param s2 scope that is potentially the subscope
 * @returns whether s2 is a subscope of s1
 */
export const isTeamSubScope = (s1: TeamScopes, s2: TeamScopes) => {
  if (s1 == s2) { return true; }
  if (!SCOPES[s1].subscopes.size) { return false; }

  return Array.from(SCOPES[s1].subscopes.values()).some(s => isTeamSubScope(s, s2));
};
