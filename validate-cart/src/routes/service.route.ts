import { Router } from 'express';
import { logger } from '../utils/logger.utils';
import { cartController } from '../controllers/cart.controller';
import CustomError from '../errors/custom.error';

const serviceRouter = Router();

serviceRouter.post('/', async (req, res, next) => {
  logger.info('Cart update extension executed');

  try {
    const { action, resource } = req.body;
    const { statusCode, actions } = (await cartController(action, resource))!;
    res.status(statusCode).json(actions);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

export default serviceRouter;
