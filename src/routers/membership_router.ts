import bodyParser from 'body-parser';
import express from 'express';
import { createValidator } from 'express-joi-validation';
import requireScope from 'auth/requireScope';
import requireSelf from 'auth/requireSelf';
import requireMembership from 'auth/requireMembership';
import { UserScopes } from 'db/models/user'; 
import { TeamScopes } from 'db/models/team';
import { membershipController } from 'controllers';
import { errorHandler } from 'errors';
import { validationErrorHandler } from 'validation';
import { CreateMembershipSchema, UpdateMembershipSchema } from 'validation/memberships';

const router = express();
const validator = createValidator({ passError: true });

// TODO: Move middleware attachment to test file
if (process.env.NODE_ENV === 'test') {
  // enable json message body for posting data to router
  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(bodyParser.json());
}

router.route('/')
  .post(
    requireScope(UserScopes.User),
    requireMembership(TeamScopes.Owner),
    validator.body(CreateMembershipSchema),
    membershipController.createMembership,
  );

router.route('/:id')
  .get(
    requireScope(UserScopes.User),
    requireSelf(UserScopes.Admin),
    requireMembership(TeamScopes.User),
    membershipController.getMembership,
  )
  .patch(
    requireScope(UserScopes.User),
    requireMembership(TeamScopes.Owner),
    validator.body(UpdateMembershipSchema),
    membershipController.updateMembership,
  )
  .delete(
    requireScope(UserScopes.User),
    requireMembership(TeamScopes.Owner),
    membershipController.deleteMembership,
  );

if (process.env.NODE_ENV === 'test') {
  router.use(validationErrorHandler);
  router.use(errorHandler);
}

export default router;