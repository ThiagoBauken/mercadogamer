'use strict';

// Define schema
module.exports = (module) => {
  /**
   * Schema
   */
  module.schema = new global.database.mongodb.mongoose.Schema(
    {
      id: { type: String },
      featured: { type: Boolean, default: false },
      enabled: { type: Boolean, default: true },
      name: { type: String, required: true },
      picture: { type: String },
      description: { type: String },
      price: {
        type: Number,
        required: true,
        validate: {
          validator: (v) => v > 0 && v < 100000,
        },
      },
      totalStock: { type: Number, default: 1 },
      stock: { type: Number, default: 1 },
      sold: { type: Number, default: 0 },
      commission: { type: Number, required: true },
      iva: { type: Number, required: true },
      priceWithDiscount: { type: Number },
      sellerProfit: { type: Number },
      discount: { type: Boolean },
      priority: { type: Number, default: 7 },
      type: {
        type: String,
        enum: ['game', 'giftCard', 'item', 'moneda', 'pack'],
        required: true,
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
      },
      publicationType: {
        type: String,
        enum: ['free', 'normal', 'pro'],
        default: 'normal',
      },
      platform: [
        {
          type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
          ref: 'platforms',
          required: true,
        },
      ],
      category: {
        type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
        ref: 'categories',
        required: true,
      },
      countries: [
        {
          type: String,
        },
      ],
      game: {
        type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
        ref: 'games',
      },
      user: {
        type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
      alegraId: {
        type: Number,
      },
    },
    { timestamps: true }
  );
};
