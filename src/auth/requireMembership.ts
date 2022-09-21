import { RequestHandler } from 'express';
import passport from 'passport';
import { isTeamSubScope } from './teamScopes';
import { IUser, UserScopes } from 'db/models/user';
import { IMembership } from 'db/models/membership';
import { TeamScopes } from 'db/models/team';
import { membershipService } from 'services';

/**
 * Middleware that requires a minimum scope to access the protected route
 * @param scope minimum scope to require on protected route
 * @returns express middleware handler
 */
const requireMembership = (scope: TeamScopes): RequestHandler => (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (err, user: IUser, info) => {
    if (err) { return next(err); }
    if (!user) { return res.status(401).json({ message: info?.message || 'Error authenticating email and password' }); }
    if (user.role === UserScopes.Admin) { // override if site admin
      const membership: IMembership[] = await membershipService.getMemberships({ userId: user.id });
      if (membership.length === 0) { 
        console.log('No membership found');
        return res.status(403).json({ message: 'Unauthorized: not a team member' }); 
      }
      if (!isTeamSubScope(membership[0].role, scope)) { 
        console.log('Team scope reject');
        return res.status(403).json({ message: 'Unauthorized' }); 
      }
    }
    
    req.user = user;
    return next();
  })(req, res, next);
};

export default requireMembership;
