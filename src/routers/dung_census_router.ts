import bodyParser from 'body-parser';
import express from 'express';
import { createValidator } from 'express-joi-validation';
import requireScope from 'auth/requireScope';
import requireMembership from 'auth/requireMembership';
import { UserScopes } from 'db/models/user'; 
import { TeamScopes } from 'db/models/team';
import { dungCensusController } from 'controllers';
import { errorHandler } from 'errors';
import { validationErrorHandler } from 'validation';
import { CreateDungCensusSchema, UpdateDungCensusSchema } from 'validation/dung_census';

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
    validator.body(CreateDungCensusSchema),
    dungCensusController.createDungCensus,
  )
  .get(
    requireScope(UserScopes.User),
    requireMembership(TeamScopes.User),
    dungCensusController.getDungCensus,
  );

router.route('/:id')
  .patch(
    requireScope(UserScopes.User),
    requireMembership(TeamScopes.User),
    validator.body(UpdateDungCensusSchema),
    dungCensusController.updateDungCensus,
  )
  .delete(
    requireScope(UserScopes.User),
    requireMembership(TeamScopes.User),
    dungCensusController.deleteDungCensus,
  );

if (process.env.NODE_ENV === 'test') {
  router.use(validationErrorHandler);
  router.use(errorHandler);
}

export default router;