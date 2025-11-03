'use strict';

// Define schema
module.exports = (module) => {
  /**
   * Schema
   */
  module.schema = new global.database.mongodb.mongoose.Schema(
    {
      id: { type: String },
      name: { type: String },
      types: [
        { type: String, enum: ['game', 'giftCard', 'item', 'coin', 'pack'] },
      ],
      enabled: { type: Boolean, default: true },
      picture: { type: String },
    },
    { timestamps: true }
  );
};
