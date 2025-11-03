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
        if (req.body.passwordNew != req.body.passwordNewVerify) {
          return reject(
            helper.lib.httpError(
              404,
              'El password nuevo y la verfificacion deben coincidir'
            )
          );
        }

        model
          .findById(req.params.id)
          .then(async (result) => {
            if (result) {
              // if (!req.body.password || !helper.lib.bcrypt.compareSync(req.body.password, result.password)) {
              //   return reject(helper.lib.httpError(404, 'Password incorrecto'));
              // } else {
              result.password = helper.lib.bcrypt.hashSync(
                req.body.passwordNew,
                helper.settings.crypto.saltRounds
              );
              result = await result.save();
              let data = result.toJSON();
              data.token = helper.lib.jsonwebtoken.sign(
                data,
                helper.settings.token.secret
              );
              resolve(data);
              // }
            } else {
              reject(helper.lib.httpError(404, 'No se encontro la entidad'));
            }
          })
          .catch((error) => {
            reject(
              helper.lib.httpError(
                404,
                error.message || 'Ocurrio un error inesperado'
              )
            );
          });
      } catch (error) {
        console.error('Helper "database.createUser" response error');
        console.error(error);
        reject(error);
      }
    });
  };
};
