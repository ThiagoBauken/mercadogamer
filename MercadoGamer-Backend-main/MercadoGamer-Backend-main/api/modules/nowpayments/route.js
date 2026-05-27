'use strict';

const NowPaymentsApi = require('@nowpaymentsio/nowpayments-api-js');

// Define module
module.exports = (module) => {
  /**
   * Get available currencies
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get('/currencies', async (req, res, next) => {
    try {
      const apiKey = module.settings.nowpayments[module.settings.nowpayments.env].apiKey;
      const nowPayments = new NowPaymentsApi({ apiKey });

      const currencies = await nowPayments.getCurrencies();

      res.status(200).json({
        currencies: currencies.currencies || currencies,
      });
    } catch (error) {
      console.error('Error fetching currencies:', error);
      res.status(500).json({ error: 'Failed to fetch available currencies' });
    }
  });

  /**
   * Get estimated price
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get('/estimate', async (req, res, next) => {
    try {
      const { amount, currency_from, currency_to } = req.query;

      if (!amount || !currency_from || !currency_to) {
        return res.status(400).json({
          error: 'amount, currency_from, and currency_to are required',
        });
      }

      const apiKey = module.settings.nowpayments[module.settings.nowpayments.env].apiKey;
      const nowPayments = new NowPaymentsApi({ apiKey });

      const estimate = await nowPayments.getEstimatedPrice({
        amount: parseFloat(amount),
        currency_from,
        currency_to,
      });

      res.status(200).json(estimate);
    } catch (error) {
      console.error('Error getting estimate:', error);
      res.status(500).json({ error: 'Failed to get price estimate' });
    }
  });

  /**
   * Create Payment
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.post('/create-payment', async (req, res, next) => {
    try {
      const {
        priceAmount,
        priceCurrency,
        payCurrency,
        externalReference,
        description,
      } = req.body;

      if (!priceAmount || !payCurrency || !externalReference) {
        return res.status(400).json({
          error: 'priceAmount, payCurrency, and externalReference are required',
        });
      }

      const apiKey = module.settings.nowpayments[module.settings.nowpayments.env].apiKey;
      const nowPayments = new NowPaymentsApi({ apiKey });

      const paymentParams = {
        price_amount: parseFloat(priceAmount),
        price_currency: priceCurrency || 'USD',
        pay_currency: payCurrency,
        order_id: externalReference.toString(),
        order_description: description || 'Purchase on MercadoGamer',
        ipn_callback_url: module.settings.nowpayments.ipnCallbackUrl,
      };

      const payment = await nowPayments.createPayment(paymentParams);

      // Save to database
      await module.model.create({
        paymentId: payment.payment_id,
        externalReference: externalReference.toString(),
        priceAmount: parseFloat(priceAmount),
        priceCurrency: priceCurrency || 'USD',
        payAmount: payment.pay_amount,
        payCurrency: payment.pay_currency,
        payAddress: payment.pay_address,
        status: payment.payment_status,
        user: req.user?.id,
        nowpaymentsResponse: payment,
      });

      res.status(200).json({
        paymentId: payment.payment_id,
        payAddress: payment.pay_address,
        payAmount: payment.pay_amount,
        payCurrency: payment.pay_currency,
        paymentStatus: payment.payment_status,
      });
    } catch (error) {
      console.error('NowPayments Create Payment Error:', error);
      res.status(400).json({
        error: error.message || 'Failed to create crypto payment',
      });
    }
  });

  /**
   * Get Payment Status
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get('/payment-status/:paymentId', async (req, res, next) => {
    try {
      const { paymentId } = req.params;

      const apiKey = module.settings.nowpayments[module.settings.nowpayments.env].apiKey;
      const nowPayments = new NowPaymentsApi({ apiKey });

      const paymentStatus = await nowPayments.getPaymentStatus({ id: paymentId });

      // Update database
      await module.model.findOneAndUpdate(
        { paymentId },
        {
          status: paymentStatus.payment_status,
          actuallyPaid: paymentStatus.actually_paid,
          outcomeAmount: paymentStatus.outcome_amount,
          nowpaymentsResponse: paymentStatus,
        }
      );

      res.status(200).json(paymentStatus);
    } catch (error) {
      console.error('Error fetching payment status:', error);
      res.status(500).json({ error: 'Failed to fetch payment status' });
    }
  });

  /**
   * IPN Callback Handler
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.post('/ipn', async (req, res, next) => {
    try {
      const ipnData = req.body;

      console.log('NowPayments IPN received:', ipnData);

      // Verify IPN signature if configured
      const ipnSecret = module.settings.nowpayments.ipnSecret;
      if (ipnSecret) {
        const receivedSignature = req.headers['x-nowpayments-sig'];
        // Implement signature verification if needed
        // const isValid = verifySignature(ipnData, receivedSignature, ipnSecret);
        // if (!isValid) {
        //   return res.status(403).json({ error: 'Invalid signature' });
        // }
      }

      const { payment_id, payment_status, order_id, actually_paid, outcome_amount } = ipnData;

      // Update database
      const payment = await module.model.findOneAndUpdate(
        { paymentId: payment_id },
        {
          status: payment_status,
          actuallyPaid: actually_paid,
          outcomeAmount: outcome_amount,
          nowpaymentsResponse: ipnData,
        },
        { new: true }
      );

      // Process order if payment is finished
      if (payment_status === 'finished' && payment && payment.externalReference) {
        const pendingOrders = await global.modules.pendingOrders.model
          .findById(payment.externalReference)
          .populate('user')
          .lean();

        if (pendingOrders) {
          await global.helpers.orders.createOrders(
            pendingOrders,
            false,
            module.lib.eventEmitter,
            payment_id
          );
        }
      }

      res.status(200).json({ status: 'OK' });
    } catch (error) {
      console.error('IPN processing error:', error);
      res.status(500).json({ error: 'IPN processing failed' });
    }
  });

  /**
   * Get minimum payment amount for a currency
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get('/min-amount/:currency', async (req, res, next) => {
    try {
      const { currency } = req.params;

      const apiKey = module.settings.nowpayments[module.settings.nowpayments.env].apiKey;
      const nowPayments = new NowPaymentsApi({ apiKey });

      const minAmount = await nowPayments.getMinimumPaymentAmount({
        currency_from: 'USD',
        currency_to: currency,
      });

      res.status(200).json(minAmount);
    } catch (error) {
      console.error('Error getting minimum amount:', error);
      res.status(500).json({ error: 'Failed to get minimum amount' });
    }
  });
};
