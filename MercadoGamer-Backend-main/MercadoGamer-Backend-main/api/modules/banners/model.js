'use strict';

// Define schema
module.exports = (module) => {
  /**
   * Schema
   */
  module.schema = new global.database.mongodb.mongoose.Schema(
    {
      id: { type: String },
      picture: { type: String },
      isMobile: { type: Boolean },
      redirectUrl: { type: String },
      secondUrl: { type: String },
    },
    { timestamps: true }
  );
};
