import bodyParser from 'body-parser';
import express from 'express';
import { createValidator } from 'express-joi-validation';
import requireScope from 'auth/requireScope';
import requireMembership from 'auth/requireMembership';
import { UserScopes } from 'db/models/user'; 
import { TeamScopes } from 'db/models/team';
import { plotController } from 'controllers';
import { errorHandler } from 'errors';
import { validationErrorHandler } from 'validation';
import { CreatePlotSchema, UpdatePlotSchema } from 'validation/plots';

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
    validator.body(CreatePlotSchema),
    plotController.createPlot,
  )
  .get(
    requireScope(UserScopes.User),
    requireMembership(TeamScopes.User),
    plotController.getPlots,
  );
  
router.route('/:id')
  .get(
    requireScope(UserScopes.User),
    requireMembership(TeamScopes.User),
    plotController.getPlot,
  )
  .patch(
    requireScope(UserScopes.User),
    requireMembership(TeamScopes.User),
    validator.body(UpdatePlotSchema),
    plotController.updatePlot,
  )
  .delete(
    requireScope(UserScopes.User),
    requireMembership(TeamScopes.User),
    plotController.deletePlot,
  );

if (process.env.NODE_ENV === 'test') {
  router.use(validationErrorHandler);
  router.use(errorHandler);
}

export default router;