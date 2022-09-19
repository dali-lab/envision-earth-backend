import { RequestHandler } from 'express';
import { isUserSubScope } from 'auth/userScopes';
import { IUser, UserScopes } from 'db/models/user';

/**
 * Middleware enforcing that a user can only edit their own model (user id matches params.id)
 * @param adminScope scope that will override user and params id matching
 * @returns express request handler
 */
const requireSelf = (adminScope: UserScopes): RequestHandler => (req, res, next) => {
  try {
    const user = req.user as IUser;

    if (!user) { return res.status(400).json({ message: 'No user object attached' }); }
    if (!req.params.id) { return res.status(400).json({ message: 'Invalid URL id' }); }

    if (user.id !== req.params.id && !isUserSubScope(user.role, adminScope)) { return res.status(403).json({ message: 'Unauthorized' }); }

    return next();
  } catch (e: any) {
    console.log(e);
    throw e;
  }
};

export default requireSelf;
