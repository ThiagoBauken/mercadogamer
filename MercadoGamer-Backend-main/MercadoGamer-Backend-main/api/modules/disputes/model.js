'use strict';

/**
 * Disputas (P0.3) — sistema formal de resolução de conflitos.
 *
 * Fluxo:
 *   1. Comprador abre disputa → status='open', order.releaseBlocked=true
 *   2. Vendedor responde em até X dias → status='awaiting_buyer'
 *   3. Comprador aceita resposta → resolved_seller (libera escrow) OU
 *      escala pra admin → status='admin_review'
 *   4. Admin decide:
 *      - resolved_buyer → refund (order.status='cancelled', sem release)
 *      - resolved_seller → libera escrow (status='released')
 *
 * Razões (reason) baseadas nas mais comuns em marketplaces de games:
 *   - not_received: vendedor não entregou
 *   - not_working: conta/produto inválido/banido
 *   - fake: conta diferente do anunciado (nível/skins)
 *   - chargeback: comprador disputou no banco
 *   - other: descrever em texto livre
 */
module.exports = (module) => {
  const mongoose = global.database.mongodb.mongoose;

  module.schema = new mongoose.Schema(
    {
      order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders',
        required: true,
        index: true,
      },
      buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        index: true,
      },
      seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        index: true,
      },
      reason: {
        type: String,
        enum: ['not_received', 'not_working', 'fake', 'chargeback', 'other'],
        required: true,
      },
      description: {
        type: String,
        required: true,
        maxlength: 5000,
      },
      status: {
        type: String,
        enum: [
          'open',              // recém aberta — esperando vendedor
          'awaiting_seller',   // vendedor tem prazo pra responder
          'awaiting_buyer',    // vendedor respondeu — comprador avalia
          'admin_review',      // escalada — admin decide
          'resolved_buyer',    // resolvida favor comprador (refund)
          'resolved_seller',   // resolvida favor vendedor (libera escrow)
          'cancelled',         // disputa cancelada pelo próprio buyer
        ],
        default: 'open',
        index: true,
      },
      // Evidências (URLs de arquivos no /api/files/upload)
      evidence: [
        {
          type: String, // path/filename retornado pelo upload
        },
      ],
      // Histórico de mensagens entre as partes
      messages: [
        {
          from: {
            type: String,
            enum: ['buyer', 'seller', 'admin'],
            required: true,
          },
          authorUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
          },
          content: { type: String, required: true, maxlength: 5000 },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      // Resolução (preenchido quando status vira resolved_*)
      resolution: {
        decision: {
          type: String,
          enum: ['refund_buyer', 'release_seller', 'split'],
        },
        decidedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users',
        },
        reason: { type: String, maxlength: 2000 },
        refundAmount: { type: Number },
        decidedAt: { type: Date },
      },
      // SLA — vendedor tem 48h pra responder ou disputa escala automaticamente
      sellerResponseDeadline: { type: Date },
      resolvedAt: { type: Date },
    },
    { timestamps: true }
  );

  // Índices compostos pra queries comuns
  module.schema.index({ order: 1, status: 1 });
  module.schema.index({ status: 1, createdAt: -1 }); // admin listar disputas abertas
};
