import { UserScopes } from 'db/models/user';

interface IUserScope {
  name: UserScopes,
  subscopes: Set<UserScopes>
}

const AdminScope: IUserScope = {
  name: UserScopes.Admin,
  subscopes: new Set<UserScopes>([UserScopes.User, UserScopes.Unverified]),
};

const UserScope: IUserScope = {
  name: UserScopes.User,
  subscopes: new Set([]),
};

const UnverifiedScope: IUserScope = {
  name: UserScopes.Unverified,
  subscopes: new Set([]),
};

export const SCOPES: Record<UserScopes, IUserScope> = {
  ADMIN: AdminScope,
  USER: UserScope,
  UNVERIFIED: UnverifiedScope,
};

/**
 * A function that checks if s2 is a subscope of s1
 * @param s1 scope that is potentially the parent scope
 * @param s2 scope that is potentially the subscope
 * @returns whether s2 is a subscope of s1
 */
export const isUserSubScope = (s1: UserScopes, s2: UserScopes) => {
  if (s1 == s2) { return true; }
  if (!SCOPES[s1].subscopes.size) { return false; }

  return Array.from(SCOPES[s1].subscopes.values()).some(s => isUserSubScope(s, s2));
};
