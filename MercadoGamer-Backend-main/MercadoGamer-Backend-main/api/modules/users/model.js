'use strict';

// Define schema
module.exports = (module) => {
  /**
   * Schema
   */
  module.schema = new global.database.mongodb.mongoose.Schema(
    {
      id: { type: String },
      address: { type: String },
      city: { type: String },
      province: { type: String },
      emailAddress: { type: String },
      firstName: { type: String },
      enabled: { type: Boolean, default: true },
      lastName: { type: String },
      password: { type: String, required: true },
      phoneNumber: { type: String },
      picture: { type: String },
      roles: [{ type: String, allowNull: false, enum: ['user', 'seller'] }],
      username: { type: String, required: true, unique: true },
      postalCode: { type: Number },
      description: { type: String },
      dniPicture: { type: String },
      identificationNumber: { type: Number },
      bannerDesktop: { type: String },
      bannerMobile: { type: String },
      userQualification: { type: Number, default: 0 },
      sellerQualification: { type: Number, default: 0 },
      userTotalQualifications: { type: Number, default: 0 },
      sellerTotalQualifications: { type: Number, default: 0 },
      hasFirstSale: { type: Boolean, default: false },
      hasFirstVisitVendor: { type: Boolean, default: false },
      balance: { type: Number, default: 0 }, // ARS
      gift: { type: Number, default: 0 }, // ARS
      referredBy: {
        type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: false,
      },
      referrerUsedTheDrop: {
        type: Boolean,
        default: false,
      },
      extraRouletteDrop: {
        type: Number,
        default: 0,
      },
      firstRoulettePlay: { type: Boolean, default: false },
      country: {
        type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
        ref: 'countries',
        required: true,
      },
      verificationSms: { type: Boolean, default: false },
      discountCodes: [
        {
          type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
          ref: 'discountCodes',
        },
      ],
    },
    { timestamps: true }
  );

  module.schema.post('validate', function (doc) {
    const role = 'user';
    if (!doc.roles.includes(role)) {
      doc.roles.push(role);
    }
  });
};
