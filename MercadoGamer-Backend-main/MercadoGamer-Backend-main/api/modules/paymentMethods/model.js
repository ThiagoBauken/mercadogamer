'use strict';

// Define schema
module.exports = (module) => {
  /**
   * Schema
   */
  module.schema = new global.database.mongodb.mongoose.Schema(
    {
      id: { type: String },
      identifier: { type: String }, // cbu / cvu / email
      type: { type: String, enum: ['mercadoPago', 'bankTransfer'] },
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
