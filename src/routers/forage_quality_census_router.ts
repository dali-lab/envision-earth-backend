import bodyParser from 'body-parser';
import express from 'express';
import { createValidator } from 'express-joi-validation';
import requireScope from 'auth/requireScope';
import requireMembership from 'auth/requireMembership';
import { UserScopes } from 'db/models/user'; 
import { TeamScopes } from 'db/models/team';
import { forageQualityCensusController } from 'controllers';
import { errorHandler } from 'errors';
import { validationErrorHandler } from 'validation';
import { CreateForageQualityCensusSchema, UpdateForageQualityCensusSchema } from 'validation/forage_quality_census';

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
    validator.body(CreateForageQualityCensusSchema),
    forageQualityCensusController.createForageQualityCensus,
  )
  .get(
    requireScope(UserScopes.User),
    requireMembership(TeamScopes.User),
    forageQualityCensusController.getForageQualityCensus,
  );

router.route('/:id')
  .patch(
    requireScope(UserScopes.User),
    requireMembership(TeamScopes.User),
    validator.body(UpdateForageQualityCensusSchema),
    forageQualityCensusController.updateForageQualityCensus,
  )
  .delete(
    requireScope(UserScopes.User),
    requireMembership(TeamScopes.User),
    forageQualityCensusController.deleteForageQualityCensus,
  );

if (process.env.NODE_ENV === 'test') {
  router.use(validationErrorHandler);
  router.use(errorHandler);
}

export default router;