'use strict';

const { hasIn, result } = require('lodash');

// Define module
module.exports = (module) => {
  /**
   * loadProductContents
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
};
