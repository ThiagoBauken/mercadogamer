'use strict';

const stripe = require('stripe');

// Define module
module.exports = (module) => {
  /**
   * Create Payment Intent
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.post('/create-payment-intent', async (req, res, next) => {
    try {
      const stripeClient = stripe(
        module.settings.stripe[module.settings.stripe.env].secretKey
      );

      const { amount, currency, externalReference, description, customerEmail } = req.body;

      if (!amount || !externalReference) {
        return res.status(400).json({
          error: 'Amount and externalReference are required',
        });
      }

      const paymentIntentParams = {
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency || 'usd',
        description: description ||  'Purchase on MercadoGamer',
        metadata: {
          externalReference: externalReference.toString(),
        },
        automatic_payment_methods: {
          enabled: true,
        },
      };

      if (customerEmail) {
        paymentIntentParams.receipt_email = customerEmail;
      }

      const paymentIntent = await stripeClient.paymentIntents.create(paymentIntentParams);

      // Save to database
      await module.model.create({
        paymentIntentId: paymentIntent.id,
        externalReference: externalReference.toString(),
        amount: amount,
        currency: currency || 'usd',
        status: 'pending',
        customerEmail,
        user: req.user?.id,
        stripeResponse: paymentIntent,
      });

      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } catch (error) {
      console.error('Stripe Payment Intent Error:', error);
      res.status(400).json({
        error: error.message || 'Failed to create payment intent',
      });
    }
  });

  /**
   * Get Payment Intent Status
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get('/payment-status/:paymentIntentId', async (req, res, next) => {
    try {
      const { paymentIntentId } = req.params;

      const payment = await module.model.findOne({ paymentIntentId });

      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      res.status(200).json({
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
      });
    } catch (error) {
      console.error('Error fetching payment status:', error);
      res.status(500).json({ error: 'Failed to fetch payment status' });
    }
  });

  /**
   * Stripe Webhook Handler
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.post('/webhook', async (req, res, next) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = module.settings.stripe.webhookSecret;

    let event;

    try {
      const stripeClient = stripe(
        module.settings.stripe[module.settings.stripe.env].secretKey
      );

      // Verify webhook signature
      event = stripeClient.webhooks.constructEvent(req.rawBody || req.body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          console.log('PaymentIntent succeeded:', paymentIntent.id);

          // Update database
          const payment = await module.model.findOneAndUpdate(
            { paymentIntentId: paymentIntent.id },
            { status: 'succeeded', stripeResponse: paymentIntent },
            { new: true }
          );

          if (payment && payment.externalReference) {
            // Process the order
            const pendingOrders = await global.modules.pendingOrders.model
              .findById(payment.externalReference)
              .populate('user')
              .lean();

            if (pendingOrders) {
              await global.helpers.orders.createOrders(
                pendingOrders,
                false,
                module.lib.eventEmitter,
                paymentIntent.id
              );
            }
          }
          break;

        case 'payment_intent.payment_failed':
          const failedPayment = event.data.object;
          console.log('PaymentIntent failed:', failedPayment.id);

          await module.model.findOneAndUpdate(
            { paymentIntentId: failedPayment.id },
            { status: 'failed', stripeResponse: failedPayment }
          );
          break;

        case 'payment_intent.canceled':
          const canceledPayment = event.data.object;
          console.log('PaymentIntent canceled:', canceledPayment.id);

          await module.model.findOneAndUpdate(
            { paymentIntentId: canceledPayment.id },
            { status: 'canceled', stripeResponse: canceledPayment }
          );
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook processing error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  });

  /**
   * Get publishable key
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get('/config', (req, res, next) => {
    res.status(200).json({
      publishableKey: module.settings.stripe[module.settings.stripe.env].publishableKey,
    });
  });
};
