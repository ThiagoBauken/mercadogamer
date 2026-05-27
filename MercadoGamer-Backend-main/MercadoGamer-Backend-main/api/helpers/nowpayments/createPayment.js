'use strict';

const NowPaymentsApi = require('@nowpaymentsio/nowpayments-api-js');

// Define module
module.exports = (helper) => {
  /**
   * Create NowPayments crypto payment
   *
   * @param {Object} params - Parameters
   * @return {Promise}
   */
  return (params) => {
    return new Promise(async (resolve, reject) => {
      try {
        const apiKey = helper.settings.nowpayments[helper.settings.nowpayments.env].apiKey;

        if (!apiKey) {
          throw new Error('NowPayments API key not configured');
        }

        const nowPayments = new NowPaymentsApi({ apiKey });

        const paymentParams = {
          price_amount: params.priceAmount,
          price_currency: params.priceCurrency || 'USD',
          pay_currency: params.payCurrency || 'BTC',
          order_id: params.externalReference,
          order_description: params.description || 'Purchase on MercadoGamer',
          ipn_callback_url: params.ipnCallbackUrl || helper.settings.nowpayments.ipnCallbackUrl,
        };

        // Optional: specify pay_amount instead of price_amount
        if (params.payAmount) {
          paymentParams.pay_amount = params.payAmount;
          delete paymentParams.price_amount;
        }

        const payment = await nowPayments.createPayment(paymentParams);

        resolve({
          success: true,
          payment,
          paymentId: payment.payment_id,
          payAddress: payment.pay_address,
          payAmount: payment.pay_amount,
          payCurrency: payment.pay_currency,
          paymentStatus: payment.payment_status,
        });
      } catch (error) {
        console.error('NowPayments Create Payment Error:', error);
        reject(
          helper.lib.dbError(
            400,
            error.message || 'Failed to create crypto payment'
          )
        );
      }
    });
  };
};
