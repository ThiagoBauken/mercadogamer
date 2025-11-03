'use strict';

// Define module
module.exports = (helper) => {
  /**
   * Select
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} model - Model
   * @return {Promise}
   */
  return (req, res, model) => {
    return new Promise((resolve, reject) => {
      const params = req.body;
      const id = req.params.id || '';
      model
        .findOneAndUpdate({ _id: id }, params, { new: true })
        .then((data) => {
          resolve({ data });
        })
        .catch((error) => {
          reject(
            helper.lib.httpError(
              400,
              error.message || 'Ocurrio un error inesperado'
            )
          );
        });
    });
  };
};
