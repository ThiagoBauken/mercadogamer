"use strict";

// Define schema
module.exports = (module) => {
  /**
   * Schema
   */
  module.schema = new global.database.mongodb.mongoose.Schema(
    {
      id: { type: String },
      answer: { type: String },
      question: { type: String },
      buyer: {
        type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      seller: {
        type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      product: {
        type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
    },
    { timestamps: true }
  );
};
