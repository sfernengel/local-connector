import { UpdateAction } from '@commercetools/sdk-client-v2';

import { createApiRoot } from '../client/create.client';
import CustomError from '../errors/custom.error';
import { Resource } from '../interfaces/resource.interface';

/**
 * Handle the create action
 *
 * @param {Resource} resource The resource from the request body
 * @returns {object}
 */
const create = async (resource: Resource) => {
  let productId = undefined;

  try {
    const updateActions: Array<UpdateAction> = [];

    // Deserialize the resource to a CartDraft
    const cartDraft = JSON.parse(JSON.stringify(resource));

    if (cartDraft.obj.lineItems.length !== 0) {
      productId = cartDraft.obj.lineItems[0].productId;
    }

    // Fetch the product with the ID
    if (productId) {
      await createApiRoot()
        .products()
        .withId({ ID: productId })
        .get()
        .execute();

      // Work with the product
    }

    // Create the UpdateActions Object to return it to the client
    const updateAction: UpdateAction = {
      action: 'recalculate',
      updateProductData: false,
    };

    updateActions.push(updateAction);

    return { statusCode: 200, actions: updateActions };
  } catch (error) {
    // Retry or handle the error
    // Create an error object
    if (error instanceof Error) {
      throw new CustomError(
        400,
        `Internal server error on CartController: ${error.stack}`
      );
    }
  }
};

// Controller for update actions
const update = async (resource: Resource) => {
  let sku = undefined;
  let quantity = 0;

  try {
    const updateActions: Array<UpdateAction> = [];

    // Deserialize the resource to a CartDraft
    const cartDraft = JSON.parse(JSON.stringify(resource));

    if (cartDraft.obj.lineItems.length !== 0) {
      sku = cartDraft.obj.lineItems[0].variant.sku;
      quantity = cartDraft.obj.lineItems[0].quantity;
    }

    // Check the inventory for a given sku
    if (sku) {
      const inventory = await createApiRoot()
        .inventory()
        .get({
          queryArgs: {
            where: `sku="${sku}"`,
          },
        })
        .execute()
        .then((res) => res.body.results?.[0]);

      if (!inventory) {
        throw new CustomError(400, `The inventory entry not found for: ${sku}`);
      }

      // Work with the inventories
      if (inventory.availableQuantity < quantity) {
        throw new CustomError(
          400,
          `Stock level for: ${sku} is less than: ${quantity}`
        );
      }
    }

    return { statusCode: 200, actions: updateActions };
  } catch (error) {
    if (error instanceof CustomError) {
      console.log('1');
      throw error;
    } else if (error instanceof Error) {
      console.log('2');
      throw new CustomError(
        400,
        `Internal server error on CartController: ${error.stack}`
      );
    }
  }
};

/**
 * Handle the cart controller according to the action
 *
 * @param {string} action The action that comes with the request. Could be `Create` or `Update`
 * @param {Resource} resource The resource from the request body
 * @returns {Promise<object>} The data from the method that handles the action
 */
export const cartController = async (action: string, resource: Resource) => {
  switch (action) {
    case 'Create': {
      const data = create(resource);
      return data;
    }
    case 'Update': {
      const data = update(resource);
      return data;
    }
    default:
      throw new CustomError(
        500,
        `Internal Server Error - Resource not recognized. Allowed values are 'Create' or 'Update'.`
      );
  }
};
