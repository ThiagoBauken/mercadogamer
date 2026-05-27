'use strict';

/**
 * Middleware: bloqueia rotas que exigem nível mínimo de KYC.
 *
 * Uso em route.js:
 *   const { requireKyc } = global.helpers.security;
 *   module.router.post(
 *     '/createNewProduct',
 *     global.helpers.security.auth(['user']),
 *     requireKyc(1),  // exige KYC nível 1 (email + SMS + CPF)
 *     async (req, res, next) => { ... }
 *   );
 *
 * Níveis:
 *   0 = sem verificação (default ao cadastrar)
 *   1 = email + telefone + CPF validado
 *   2 = + documento (RG/CNH) + selfie
 *   3 = + comprovante endereço + análise manual
 */
module.exports = (helper) => (minLevel = 1) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return next(helper.lib.httpError(401, 'Autenticação requerida'));
      }
      const currentLevel = req.user.kycLevel || 0;
      if (currentLevel < minLevel) {
        return next(
          helper.lib.httpError(
            403,
            `Verificação KYC nível ${minLevel} requerida para esta ação. Você está no nível ${currentLevel}. Acesse /perfil/kyc.`
          )
        );
      }
      return next();
    } catch (error) {
      console.error('Middleware requireKyc error:', error);
      return next(helper.lib.httpError(500, 'Erro ao verificar KYC'));
    }
  };
};
