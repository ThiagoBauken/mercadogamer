'use strict';

/**
 * Platform Funds (P1.7) — fundo de reembolso da plataforma.
 *
 * Mecânica:
 *   - A cada release de escrow (status held → released), 2% do escrowAmount
 *     vai automaticamente pro fundo.
 *   - Quando dispute resolved_buyer e o vendedor NÃO tem saldo suficiente
 *     pra reembolsar (já sacou), o admin pode usar o fundo.
 *   - Fundo dá segurança ao comprador: "se o vendedor sumir, a plataforma
 *     ainda reembolsa". Diferencial vs GGMax (que não tem garantia explícita).
 *
 * Esta collection é um livro-razão imutável (insert-only). Saldo do fundo
 * = SUM(amount * (type === 'credit' ? 1 : -1)).
 */
module.exports = (module) => {
  const mongoose = global.database.mongodb.mongoose;

  module.schema = new mongoose.Schema(
    {
      // 'credit' = entrada (2% de venda liberada); 'debit' = saída (reembolso pago)
      type: {
        type: String,
        enum: ['credit', 'debit'],
        required: true,
        index: true,
      },
      amount: { type: Number, required: true, min: 0 }, // valor positivo sempre
      reason: {
        type: String,
        enum: ['escrow_release_fee', 'dispute_refund', 'manual_adjustment'],
        required: true,
      },
      // Referência ao que originou
      order: { type: mongoose.Schema.Types.ObjectId, ref: 'orders', index: true },
      dispute: { type: mongoose.Schema.Types.ObjectId, ref: 'disputes' },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }, // beneficiário em debits
      // Audit
      authorAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'administrators' },
      notes: { type: String, maxlength: 1000 },
    },
    { timestamps: true }
  );

  module.schema.index({ type: 1, createdAt: -1 });
};
