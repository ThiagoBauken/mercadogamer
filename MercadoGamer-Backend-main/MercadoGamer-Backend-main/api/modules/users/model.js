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
      verificationSms: { type: Boolean, default: false }, // Mantido legacy — use verifiedPhone

      // ═══════════════════════════════════════════════════════════
      // KYC — Know Your Customer (Lei 14.790/2023 + LGPD)
      // Documentação completa em docs/STATE.md → seção KYC
      // ═══════════════════════════════════════════════════════════
      cpf: {
        type: String,
        index: true,
        sparse: true, // permite múltiplos null (users antigos sem CPF)
        unique: true,
      },
      birthDate: { type: Date },
      fullName: { type: String }, // Nome civil (vindo de Serpro), distinto de firstName+lastName
      kycLevel: {
        type: Number,
        default: 0,
        min: 0,
        max: 3,
        index: true,
      },
      verifiedEmail: { type: Boolean, default: false },
      verifiedPhone: { type: Boolean, default: false },
      verifiedCPF: { type: Boolean, default: false },
      // Tokens/códigos sensíveis — select: false para não vazar em JSON responses
      emailVerificationToken: { type: String, select: false },
      emailVerificationExpiresAt: { type: Date, select: false },
      phoneVerificationCode: { type: String, select: false },
      phoneVerificationExpiresAt: { type: Date, select: false },
      phoneVerificationAttempts: { type: Number, default: 0, select: false },
      kycSubmittedAt: { type: Date },
      kycVerifiedAt: { type: Date },

      // KYC nível 2 — foto documento + selfie + biometria (P1.10)
      documentPhotoUrl: { type: String, select: false }, // foto do RG/CNH frente
      documentPhotoBackUrl: { type: String, select: false }, // foto do verso
      selfiePhotoUrl: { type: String, select: false },
      // Score de similaridade facial 0-100 (AWS Rekognition compareFaces)
      // ≥85 = match; <85 = falha (manual review)
      faceMatchScore: { type: Number, select: false },
      kycLevel2SubmittedAt: { type: Date },
      kycLevel2ReviewedAt: { type: Date },
      kycLevel2Status: {
        type: String,
        enum: ['none', 'pending', 'approved', 'rejected', 'manual_review'],
        default: 'none',
        index: true,
      },
      kycLevel2RejectionReason: { type: String },

      // ═══════════════════════════════════════════════════════════
      // Plano de vendedor (P1.6) — Stripe Subscriptions
      // ═══════════════════════════════════════════════════════════
      sellerPlan: {
        type: String,
        enum: ['free', 'pro', 'premium'],
        default: 'free',
        index: true,
      },
      sellerPlanActiveUntil: { type: Date }, // null = sem assinatura ativa
      stripeCustomerId: { type: String, select: false },
      stripeSubscriptionId: { type: String, select: false },
      stripeSubscriptionStatus: { type: String }, // active, trialing, past_due, canceled, etc

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
