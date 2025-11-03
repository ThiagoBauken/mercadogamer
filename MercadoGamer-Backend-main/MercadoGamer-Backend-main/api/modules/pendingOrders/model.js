module.exports = (module) => {
  module.schema = new global.database.mongodb.mongoose.Schema(
    {
      id: { type: String },
      balanceUsedUSD: { type: Number },
      user: {
        type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
      carts: [
        {
          cart_id: {
            type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
            ref: 'carts',
            required: true,
          },
          orderBuilder: {
            product: {
              type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
              ref: 'products',
              required: true,
            },
            stockProduct: {
              type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
              ref: 'stockproducts',
              required: true,
            },
            pricePaid: { type: Number, required: true },
            paymentMethod: {
              type: String,
              enum: ['giftbalance', 'mercadoPago'],
              required: true,
            },
            toUSD: { type: Number, required: true },
            sellerProfit: { type: Number, required: true },
            processingFee: { type: Number, required: true },
            buyer: {
              type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
              ref: 'users',
              required: true,
            },
            seller: {
              type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
              ref: 'users',
              required: true,
            },
            productPrice: { type: Number },
          },
        },
      ],
      orders: {
        type: [
          {
            type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
            ref: 'orders',
          },
        ],
        default: [],
      },
    },
    { strict: false, timestamps: true }
  );
};
