import bodyParser from 'body-parser';
import express from 'express';
import { createValidator } from 'express-joi-validation';
import requireScope from 'auth/requireScope';
import requireSelf from 'auth/requireSelf';
import requireMembership from 'auth/requireMembership';
import { UserScopes } from 'db/models/user'; 
import { TeamScopes } from 'db/models/team';
import { cowCensusController } from 'controllers';
import { errorHandler } from 'errors';
import { validationErrorHandler } from 'validation';
import { CreateCowCensusSchema, UpdateCowCensusSchema } from 'validation/cow_census';

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
    requireMembership(TeamScopes.User),
    validator.body(CreateCowCensusSchema),
    cowCensusController.createCowCensus,
  );

router.route('/:id')
  .get(
    requireScope(UserScopes.User),
    requireSelf(UserScopes.Admin),
    requireMembership(TeamScopes.User),
    cowCensusController.getCowCensus,
  )
  .patch(
    requireScope(UserScopes.User),
    requireMembership(TeamScopes.User),
    validator.body(UpdateCowCensusSchema),
    cowCensusController.updateCowCensus,
  )
  .delete(
    requireScope(UserScopes.User),
    requireMembership(TeamScopes.User),
    cowCensusController.deleteCowCensus,
  );

if (process.env.NODE_ENV === 'test') {
  router.use(validationErrorHandler);
  router.use(errorHandler);
}

export default router;