import { Router } from 'express';
import { logger } from '../utils/logger.utils';
import { post } from '../controllers/service.controller';

const serviceRouter = Router();

serviceRouter.post('/', async (req, res, next) => {
  logger.info('Cart update extension executed');

  try {
    await post(req, res!;
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

export default serviceRouter;
