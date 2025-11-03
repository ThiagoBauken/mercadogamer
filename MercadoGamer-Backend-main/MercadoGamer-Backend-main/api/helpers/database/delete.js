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
    return new Promise( (resolve, reject) => {
      try {

        const _id = req.params.id || '';
        // model.findOneAndRemove({_id})
        model.findById(req.params.id)
          .then(data => {
            if (data) {
              data.remove()
              .then( (d) => {
                resolve({data});
              })
              .catch( (e) => {
                reject(helper.lib.httpError(400, e.message || 'Ocurrio un error inesperado'));
              })
            } else {
              reject(helper.lib.httpError(404, 'No se encontro la entidad'));
            }
          })
          .catch(error => {
            reject(helper.lib.httpError(400, error.message || 'Ocurrio un error inesperado'));
          });

      } catch(error) {
        console.error('Helper "database.delete" response error');
        console.error(error);
        reject(error);
      }
    });
  };
};
