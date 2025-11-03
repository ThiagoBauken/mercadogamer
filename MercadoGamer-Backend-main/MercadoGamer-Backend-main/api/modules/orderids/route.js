'use strict';

const { countBy } = require('lodash');

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
  module.router.get(
    '/',
    global.helpers.security.auth(['administrator', 'user']),
    async (req, res, next) => {
      try {
        const result = await global.helpers.database.find(
          req,
          res,
          module.model
        );
        for (let item of result.data) {
          if (item.order.stockProduct.retirementType === 'automatic') {
            const KEY =
              module.settings.crypto.key +
              item.order.product._id +
              item.order.seller._id;

            const textParts =
              item.order.stockProduct.code &&
              item.order.stockProduct.code.split(':');
            if (textParts) {
              const IV = Buffer.from(textParts.shift(), 'hex');

              const encryptedCode = textParts.shift();

              const decipher = module.lib.crypto.createDecipheriv(
                'aes-256-cbc',
                Buffer.from(KEY, 'hex'),
                IV
              );

              item.order.stockProduct.code =
                decipher.update(encryptedCode, 'hex', 'utf-8') +
                decipher.final('utf-8').toString('utf-8');
            }
          }
        }
        res.send(result);
      } catch {
        console.log(error);
        next(error);
      }
    }
  );
};
