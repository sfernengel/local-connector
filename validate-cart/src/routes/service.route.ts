import { Router } from 'express';
import { logger } from '../utils/logger.utils';
import { cartController } from '../controllers/cart.controller';
import CustomError from '../errors/custom.error';

const serviceRouter = Router();

serviceRouter.post('/', async (req, res) => {
  logger.info('Cart update extension executed');

  const { action, resource } = req.body;
  try {
    await cartController(action, resource);
  } catch (error) {
    if (error instanceof CustomError) {
      if (typeof error.statusCode === 'number') {
        res.status(error.statusCode).json({
          message: error.message,
          errors: error.errors,
        });

        return;
      }
    }

    res.status(500).send('Internal server error');
  }

  res.status(200);
  res.send();
});

export default serviceRouter;
