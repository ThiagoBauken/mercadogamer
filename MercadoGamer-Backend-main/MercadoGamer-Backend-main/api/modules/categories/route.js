'use strict';

// Define module
module.exports = (module) => {
  /**
   * Find
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get('/', (req, res, next) => {
    global.helpers.database
      .find(req, res, module.model)
      .then((result) => res.send(result))
      .catch(next);
  });

  /**
   * FindById
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get('/:id', (req, res, next) => {
    global.helpers.database
      .findById(req, res, module.model)
      .then((result) => res.send(result))
      .catch(next);
  });

  /**
   * Create
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.post(
    '/',
    global.helpers.security.auth(['administrator']),
    async (req, res, next) => {
      global.helpers.database
        .create(req, res, module.model)
        .then((result) => {
          res.send(result);
        })
        .catch(next);
    }
  );

  /**
   * Update
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.put(
    '/:id',
    global.helpers.security.auth(['administrator']),
    async (req, res, next) => {
      global.helpers.database
        .update(req, res, module.model)
        .then((result) => res.send(result))
        .catch(next);
    }
  );

  /**
   * Handle Enable
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.put(
    '/handleEnable/:id',
    global.helpers.security.auth(['administrator']),
    async (req, res, next) => {
      await module.model
        .updateOne({ _id: req.params.id }, { enabled: req.body.enabled })
        .catch(next);

      if (!req.body.enabled) {
        const productsToUpdate = await global.modules.products.model
          .find({ categories: req.params.id })
          .catch(next);

        for (const product of productsToUpdate) {
          if (product.categories.length === 1) {
            await global.modules.products.model.updateOne(
              { _id: product._id },
              {
                enabled: false,
                $pull: { categories: req.params.id },
              }
            );
          } else {
            await global.modules.products.model.updateOne(
              { _id: product._id },
              { $pull: { categories: req.params.id } }
            );
          }
        }
      }

      res.send({ data: { enabled: req.body.enabled } });
    }
  );

  /**
   * Delete
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.delete(
    '/:id',
    global.helpers.security.auth(['administrator']),
    (req, res, next) => {
      global.helpers.database
        .delete(req, res, module.model)
        .then((result) => res.send(result))
        .catch(next);
    }
  );
};
