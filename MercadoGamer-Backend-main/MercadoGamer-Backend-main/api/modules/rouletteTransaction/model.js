'use strict';

// Define schema
module.exports = (module) => {
  /**
   * Schema
   */
  module.schema = new global.database.mongodb.mongoose.Schema(
    {
      id: { type: String },
      userId: {
        type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
      roullete: { type: String, required: true },
      role: { type: Boolean, default: true },
    },
    { timestamps: true }
  );
};
