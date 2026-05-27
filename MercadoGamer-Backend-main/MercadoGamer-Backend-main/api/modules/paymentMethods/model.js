'use strict';

// Define schema
module.exports = (module) => {
  /**
   * Schema
   */
  module.schema = new global.database.mongodb.mongoose.Schema(
    {
      id: { type: String },
      identifier: { type: String }, // cbu / cvu / email / crypto address
      type: { type: String, enum: ['mercadoPago', 'bankTransfer', 'stripe', 'crypto'] },
      // Para crypto (NowPayments)
      cryptoCurrency: { type: String }, // BTC, ETH, USDT, etc
      cryptoNetwork: { type: String }, // mainnet, testnet, etc
      // Para Stripe
      stripeCustomerId: { type: String },
      stripePaymentMethodId: { type: String },
      user: {
        type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
      enabled: { type: Boolean, default: true },
    },
    { timestamps: true }
  );
};
