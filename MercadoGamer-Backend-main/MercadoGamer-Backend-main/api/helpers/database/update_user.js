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
        let params = req.body;
        const id = req.params.id || '';

        delete params.password;

        model
          .findOneAndUpdate({ _id: id }, params, { new: true })
          .then((result) => {
            // Create token
            let data = result.toJSON();
            data.token = helper.lib.jsonwebtoken.sign(
              data,
              helper.settings.token.secret
            );

            resolve({ data });
          })
          .catch((error) => {
            let message = error.message || 'Ocurrio un error inesperado';

            if (error.errors) {
              if (error.errors.dni && error.errors.dni.kind == 'unique')
                message = 'DNI duplicado';
              if (
                error.errors.username &&
                error.errors.username.kind == 'unique'
              )
                message = 'Email duplicado';
              if (
                error.errors.emailAddress &&
                error.errors.emailAddress.kind == 'unique'
              )
                message = 'Email duplicado';
            }

            if (
              error.name &&
              error.code &&
              error.name === 'MongoError' &&
              error.code === 11000
            ) {
              let msg = String(error.message);
              if (msg.includes('dni')) message = 'DNI duplicado';
              else if (msg.includes('usename')) message = 'Email duplicado';
              else if (msg.includes('email')) message = 'Email duplicado';
              else message = 'Clave duplicada';
            }

            reject(helper.lib.httpError(400, message));
          });
      } catch (error) {
        console.error('Helper "database.update" response error');
        console.error(error);
        reject(error);
      }
    });
  };
};
