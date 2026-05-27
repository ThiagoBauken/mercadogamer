'use strict';

// Define schema for storing Stripe transactions
module.exports = (module) => {
  /**
   * Schema
   */
  module.schema = new global.database.mongodb.mongoose.Schema(
    {
      paymentIntentId: { type: String, required: true, unique: true },
      externalReference: { type: String }, // Link to order/cart
      amount: { type: Number, required: true },
      currency: { type: String, default: 'usd' },
      status: {
        type: String,
        enum: ['pending', 'succeeded', 'failed', 'canceled'],
        default: 'pending'
      },
      customerEmail: { type: String },
      metadata: { type: Object },
      user: {
        type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
      stripeResponse: { type: Object }, // Store full Stripe response
    },
    { timestamps: true }
  );
};
