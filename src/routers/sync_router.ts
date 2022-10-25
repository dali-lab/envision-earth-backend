import bodyParser from 'body-parser';
import express from 'express';
import requireScope from 'auth/requireScope';
import requireMembership from 'auth/requireMembership';
import { createValidator } from 'express-joi-validation';
import { UserScopes } from 'db/models/user'; 
import { TeamScopes } from 'db/models/team';
import { syncController } from 'controllers';
import { CreateSyncSchema } from 'validation/sync';

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
    validator.body(CreateSyncSchema),
    syncController.sync,
  );

export default router;
