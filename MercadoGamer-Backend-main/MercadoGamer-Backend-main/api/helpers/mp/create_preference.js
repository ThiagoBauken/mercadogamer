'use strict';

// Define module
module.exports = (helper) => {
  /**
   * Create MercadoPago preference
   *
   * Migrated from mercadopago v1 (global config) to v2 (instance-based).
   *   Before: mercadopago.configure({ access_token }); mercadopago.preferences.create(payload)
   *   After:  new MercadoPagoConfig({ accessToken }); new Preference(client).create({ body: payload })
   *
   * Return format is unchanged: resolves with the response body object so callers
   * can access response.init_point / response.id as before.
   *
   * @param {Object} params - Parameters
   * @return {Promise}
   */
  return (params) => {
    return new Promise((resolve, reject) => {
      try {
        const { MercadoPagoConfig, Preference } = helper.lib.mercadopago;

        const client = new MercadoPagoConfig({
          accessToken: helper.settings.mp[helper.settings.mp.env].accessToken,
        });

        const preferenceClient = new Preference(client);

        const preferenceBody = {
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

        preferenceClient
          .create({ body: preferenceBody })
          .then((response) => {
            // v2 returns the object directly (no .body wrapper)
            resolve(response);
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
