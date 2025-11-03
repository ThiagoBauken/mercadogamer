'use strict';

// Define schema
module.exports = (module) => {
  /**
   * Schema
   */
  module.schema = new global.database.mongodb.mongoose.Schema(
    {
      id: { type: String },
      amount: { type: Number, required: true },
      percent: { type: Number, required: true },
      drop: { type: Number },
    },
    { timestamps: true }
  );
};
