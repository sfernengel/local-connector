import { Request, Response } from 'express';
import { apiSuccess } from '../api/success.api';
import CustomError, { ErrorDetail } from '../errors/custom.error';
import { cartController } from './cart.controller';

/**
 * Exposed service endpoint.
 * - Receives a POST request, parses the action and the controller
 * and returns it to the correct controller. We should be use 3. `Cart`, `Order` and `Payments`
 *
 * @param {Request} request The express request
 * @param {Response} response The express response
 * @returns
 */
export const post = async (request: Request, response: Response) => {
  // Deserialize the action and resource from the body
  const { action, resource } = request.body;

  if (!action || !resource) {
    const errorDetails: ErrorDetail[] = [
      {
        code: 'InvalidOperation',
        message: `Bad request - Missing body parameters.`,
      },
    ];
    throw new CustomError(400, errorDetails);
  }

  // Identify the type of resource in order to redirect
  // to the correct controller
  switch (resource.typeId) {
    case 'cart':
      try {
        const data = await cartController(action, resource);

        if (data && data.statusCode === 200) {
          apiSuccess(200, data.actions, response);
          return;
        }

        const errorDetails: ErrorDetail[] = [
          {
            code: 'InvalidOperation',
            message: JSON.stringify(data),
          },
        ];
        throw new CustomError(data ? data.statusCode : 400, errorDetails);
      } catch (error) {
        if (error instanceof Error) {
          const errorDetails: ErrorDetail[] = [
            {
              code: 'InvalidOperation',
              message: error.message,
            },
          ];
          throw new CustomError(500, errorDetails);
        }
      }

      break;
    case 'payment':
      break;

    case 'order':
      break;

    default:
      const errorDetails: ErrorDetail[] = [
        {
          code: 'InvalidOperation',
          message: `Internal Server Error - Resource not recognized. Allowed values are 'cart', 'payments' or 'orders'.`,
        },
      ];
      throw new CustomError(500, errorDetails);
  }
};
