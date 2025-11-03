'use strict';

// Define schema
module.exports = (module) => {
  /**
   * Schema
   */
  module.schema = new global.database.mongodb.mongoose.Schema(
    {
      id: { type: String },
      title: { type: String },
      new: { type: Boolean, default: true },
      body: { type: String },
      files: [{ type: String }],
      user: {
        type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
    },
    { timestamps: true }
  );
};
