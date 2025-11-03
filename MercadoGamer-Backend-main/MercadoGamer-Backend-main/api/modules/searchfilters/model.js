'use strict';

// Define schema
module.exports = (module) => {
  /**
   * Schema
   */
  module.schema = new global.database.mongodb.mongoose.Schema(
    {
      id: { type: String },
      keywords: { type: String },
      count: { type: Number, default: 1 },
    },
    { timestamps: true }
  );
};
