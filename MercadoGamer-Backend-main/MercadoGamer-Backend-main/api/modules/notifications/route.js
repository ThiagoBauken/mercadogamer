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
      .then((result) => {
        const notifications = result.data.filter((item) => item.new === true);
        res.send(notifications);
      })
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
  module.router.get(
    '/:id',
    global.helpers.security.auth(['administrator', 'user']),
    (req, res, next) => {
      global.helpers.database
        .findById(req, res, module.model)
        .then((result) => res.send(result))
        .catch(next);
    }
  );

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
    global.helpers.security.auth(['administrator', 'user']),
    async (req, res, next) => {
      global.helpers.database
        .update(req, res, module.model)
        .then((result) => res.send(result))
        .catch(next);
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
