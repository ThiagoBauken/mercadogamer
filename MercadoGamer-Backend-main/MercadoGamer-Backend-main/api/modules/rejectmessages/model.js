"use strict";

// Define schema
module.exports = (module) => {
  /**
   * Schema
   */
  module.schema = new global.database.mongodb.mongoose.Schema(
    {
      id: { type: String },
      body: { type: String },
      user: {
        type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      product: {
        type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
    },
    { timestamps: true }
  );
};
