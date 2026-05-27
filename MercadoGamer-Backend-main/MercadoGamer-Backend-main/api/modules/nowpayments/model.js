'use strict';

// Define schema for storing NowPayments transactions
module.exports = (module) => {
  /**
   * Schema
   */
  module.schema = new global.database.mongodb.mongoose.Schema(
    {
      paymentId: { type: String, required: true, unique: true },
      externalReference: { type: String }, // Link to order/cart
      priceAmount: { type: Number, required: true },
      priceCurrency: { type: String, default: 'USD' },
      payAmount: { type: Number },
      payCurrency: { type: String }, // BTC, ETH, USDT, etc
      payAddress: { type: String },
      status: {
        type: String,
        enum: ['waiting', 'confirming', 'confirmed', 'sending', 'partially_paid', 'finished', 'failed', 'refunded', 'expired'],
        default: 'waiting'
      },
      actuallyPaid: { type: Number },
      outcomeAmount: { type: Number },
      user: {
        type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
      nowpaymentsResponse: { type: Object }, // Store full NowPayments response
    },
    { timestamps: true }
  );
};
