import bodyParser from 'body-parser';
import express from 'express';
import { createValidator } from 'express-joi-validation';
import requireScope from 'auth/requireScope';
import requireSelf from 'auth/requireSelf';
import requireMembership from 'auth/requireMembership';
import { UserScopes } from 'db/models/user';
import { TeamScopes } from 'db/models/team';
import { photoController } from 'controllers';
import { errorHandler } from 'errors';
import { validationErrorHandler } from 'validation';
import { CreatePhotoSchema, UpdatePhotoSchema } from 'validation/photo'; const router = express();
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
    validator.body(CreatePhotoSchema),
    photoController.createPhoto,
  );

router.route('/:id')
  .get(
    requireScope(UserScopes.User),
    requireSelf(UserScopes.Admin),
    requireMembership(TeamScopes.User),
    photoController.getPhoto,
  )
  .patch(
    requireScope(UserScopes.User),
    requireMembership(TeamScopes.User),
    validator.body(UpdatePhotoSchema),
    photoController.updatePhoto,
  )
  .delete(
    requireScope(UserScopes.User),
    requireMembership(TeamScopes.User),
    photoController.deletePhoto,
  );

if (process.env.NODE_ENV === 'test') {
  router.use(validationErrorHandler);
  router.use(errorHandler);
} export default router;
