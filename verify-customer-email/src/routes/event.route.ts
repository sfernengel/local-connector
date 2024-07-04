import { Router } from 'express';

import { logger } from '../utils/logger.utils';
import { post } from '../controllers/event.controller';

const eventRouter: Router = Router();

eventRouter.post('/', async (req, res) => {
  logger.info('Event message received');
  await post(req, res);
  res.status(200);
  res.send();
});

export default eventRouter;
