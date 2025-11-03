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
      currency: { type: String },
      picture: { type: String },
      flag: { type: String },
      processingFee: { type: Number },
      toUSD: { type: Number }, // aca se guarda el valor de un dolar a la moneda
      phoneCode: { type: String },
      code: { type: String },
    },
    { timestamps: true }
  );
};
