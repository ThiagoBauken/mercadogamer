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
      try {
        model
          .create(req.body)
          .then((data) => {
            resolve({ data });
          })
          .catch((error) => {
            console.log(error);
            reject(
              helper.lib.httpError(
                404,
                error.message || 'Ocurrio un error inesperado'
              )
            );
          });
      } catch (error) {
        console.error('Helper "database.create" response error');
        console.error(error);
        reject(error);
      }
    });
  };
};
