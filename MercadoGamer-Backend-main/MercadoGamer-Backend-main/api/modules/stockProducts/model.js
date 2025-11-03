'use strict';

// Define schema
module.exports = (module) => {
  /**
   * Schema
   */
  module.schema = new global.database.mongodb.mongoose.Schema(
    {
      id: { type: String },
      status: {
        type: String,
        enum: ['sold', 'available'],
        default: 'available',
      },
      retirementType: {
        type: String,
        enum: ['automatic', 'coordinated'],
        required: true,
      },
      code: { type: String }, // guardar encriptado TODO
      product: {
        type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true,
      },
      order: {
        type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
        ref: 'orders',
      },
    },
    { timestamps: true }
  );
};
