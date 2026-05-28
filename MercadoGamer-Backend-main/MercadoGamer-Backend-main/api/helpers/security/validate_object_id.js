'use strict';

const mongoose = require('mongoose');

/**
 * Middleware factory: valida que um req.params[paramName] é um ObjectId válido.
 *
 * Sem isso, queries Mongoose com IDs malformados retornavam 500 "Cast to ObjectId
 * failed for value X" — mensagem feia, status code errado (deveria ser 400), e
 * stack trace vazando pro client em modo dev.
 *
 * Uso:
 *   const validateId = global.helpers.security.validateObjectId;
 *   module.router.get('/orders/:id', validateId('id'), handler);
 *   module.router.get('/users/profile/:userId', validateId('userId'), handler);
 *
 * Defaults para 'id' se nenhum nome for passado.
 */
module.exports = (helper) => (paramName = 'id') => {
  return (req, res, next) => {
    const value = req.params && req.params[paramName];
    if (!value) {
      return next(helper.lib.httpError(400, `Parâmetro :${paramName} obrigatório`));
    }
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return next(
        helper.lib.httpError(400, `Parâmetro :${paramName} não é um ObjectId válido`)
      );
    }
    return next();
  };
};
