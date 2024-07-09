import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom.error'; // Assuming you have a custom error module

/**
 * Middleware for error handling
 * @param error The error object
 * @param req The express request
 * @param res The Express response
 * @param next
 * @returns
 */
export const errorMiddleware: ErrorRequestHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error); // Log the entire error object for debugging

  if (error instanceof CustomError) {
    res.status(error.statusCode).json({
      errors: error.errors,
    });
    return;
  }

  res.status(500).json({
    errors: [
      {
        code: 'InternalServerError',
        message: 'Internal server error',
      },
    ],
  });
};
