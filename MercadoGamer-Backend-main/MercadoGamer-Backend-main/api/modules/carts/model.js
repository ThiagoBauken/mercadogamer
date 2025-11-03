'use strict';

// Define schema
module.exports = (module) => {
  /**
   * Schema
   */
  module.schema = new global.database.mongodb.mongoose.Schema(
    {
      id: { type: String },
      product: {
        type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true,
      },
      user: {
        type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
      count: { type: Number },
    },
    { timestamps: true }
  );
};
