'use strict';

// Define schema
module.exports = (module) => {
  /**
   * Schema
   */
  module.schema = new global.database.mongodb.mongoose.Schema(
    {
      id: { type: String },
      title: { type: String },
      description: { type: String },
      action: {
        type: String,
        enum: [
          'question',
          'answer',
          'productPaid',
          'productRejected',
          'productAccepted',
          'newMessage',
          'purchaseSuccess',
          'saleSuccess',
          'ClaimReceive',
          'receiveSuccess',
          // Escrow (P0.2) — release automático após holdDays
          'purchaseReleased',
          'sellerPaymentReleased',
          // Disputas (P0.3) — pendentes
          'disputeOpened',
          'disputeResponded',
          'disputeResolved',
        ],
      },
      user: {
        type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
      new: { type: Boolean, default: true },
      payload: { type: Object },
    },
    { timestamps: true }
  );
};
