'use strict';

// Define module
module.exports = (helper) => {
  /**
   * Create opentok session
   *
   * @param {Object} model - Model
   * @return {Promise}
   */
  return (params) => {
    return new Promise((resolve, reject) => {
      try {
        helper.lib.mercadopago.configure({
          access_token: helper.settings.mp[helper.settings.mp.env].accessToken,
        });
        let preference = {
          external_reference: params.externalReference.toString(),
          notification_url: helper.settings.mp.urlIpn,
          back_urls: {
            success: helper.settings.mp.success_back_url,
          },
          auto_return: 'approved',
          items: [
            {
              title: params.title,
              description: params.description,
              unit_price: params.unitPrice,
              quantity: params.quantity,
            },
          ],
        };

        helper.lib.mercadopago.preferences
          .create(preference)
          .then((response) => {
            resolve(response.body);
          })
          .catch((error) => {
            reject(
              helper.lib.dbError(
                400,
                error.message || 'No se puede obtener el link de pago'
              )
            );
          });
      } catch (error) {
        console.error('Helper "mp.createPreference" response error');
        console.error(error);
        reject(error);
      }
    });
  };
};
