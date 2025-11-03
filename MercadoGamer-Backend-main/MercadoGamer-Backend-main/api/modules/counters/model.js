'use strict';

// Define schema
module.exports = (module) => {

  /**
   * Schema
   */
  module.schema = new global.database.mongodb.mongoose.Schema({
    id: { type: String },
    name: { type: String , required: true, unique: true},
    sequence: { type: Number },
  }, {
    timestamps: true
  });
};
