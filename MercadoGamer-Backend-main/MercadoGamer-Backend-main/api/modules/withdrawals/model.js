'use strict';

// Define schema
module.exports = (module) => {
  /**
   * Schema
   */
  module.schema = new global.database.mongodb.mongoose.Schema(
    {
      id: { type: String },
      amount: { type: Number },
      status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
      paymentMethod: {
        type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
        ref: 'paymentMethods',
        required: true,
      },
      userInfo: { type: String },
      taxId: { type: String },
      user: {
        type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
      invoiceId: { type: String },
    },
    { timestamps: true }
  );
};
