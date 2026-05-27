'use strict';

/**
 * KYC audit log.
 * Cada tentativa de verificação (email/phone/cpf) gera um registro aqui — útil para:
 *   - auditoria de conformidade (LGPD / Lei 14.790)
 *   - rate-limiting de tentativas
 *   - investigação de fraude
 *
 * Não é o "estado" — o estado fica em users.kycLevel / verifiedX.
 * Este é o "histórico".
 */
module.exports = (module) => {
  const mongoose = global.database.mongodb.mongoose;

  module.schema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        index: true,
      },
      type: {
        type: String,
        required: true,
        enum: ['email', 'phone', 'cpf'],
        index: true,
      },
      status: {
        type: String,
        required: true,
        enum: ['pending', 'verified', 'failed'],
        default: 'pending',
      },
      // Dados submetidos pelo user (NÃO conter PII clara em prod — hash em produção)
      data: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
      // Resposta de provider externo (Serpro/Twilio) — útil pra debug
      providerResponse: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
        select: false, // não expor em JSON
      },
      failureReason: { type: String },
      ipAddress: { type: String },
      userAgent: { type: String },
      verifiedAt: { type: Date },
    },
    { timestamps: true }
  );

  // Índice composto pra rate limiting (ex: tentativas por user nos últimos X min)
  module.schema.index({ user: 1, type: 1, createdAt: -1 });
};
