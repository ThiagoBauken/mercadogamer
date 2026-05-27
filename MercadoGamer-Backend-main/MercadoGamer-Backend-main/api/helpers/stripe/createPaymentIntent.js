'use strict';

const stripe = require('stripe');

// Define module
module.exports = (helper) => {
  /**
   * Create Stripe Payment Intent
   *
   * @param {Object} params - Parameters
   * @return {Promise}
   */
  return (params) => {
    return new Promise(async (resolve, reject) => {
      try {
        const stripeClient = stripe(
          helper.settings.stripe[helper.settings.stripe.env].secretKey
        );

        const paymentIntentParams = {
          amount: Math.round(params.amount), // Amount in cents
          currency: params.currency || 'usd',
          description: params.description || 'Purchase on MercadoGamer',
          metadata: {
            externalReference: params.externalReference,
            ...params.metadata,
          },
        };

        // Add customer email if provided
        if (params.customerEmail) {
          paymentIntentParams.receipt_email = params.customerEmail;
        }

        // Create payment intent
        const paymentIntent = await stripeClient.paymentIntents.create(
          paymentIntentParams
        );

        resolve({
          success: true,
          paymentIntent,
          clientSecret: paymentIntent.client_secret,
        });
      } catch (error) {
        console.error('Stripe Payment Intent Error:', error);
        reject(
          helper.lib.dbError(
            400,
            error.message || 'Failed to create Stripe payment intent'
          )
        );
      }
    });
  };
};
