'use strict';

/**
 * Subscriptions — log de assinaturas Stripe.
 *
 * Estado canônico vive em user.sellerPlan / sellerPlanActiveUntil /
 * stripeSubscriptionId. Esta coleção mantém o histórico imutável de eventos
 * (checkout iniciado, ativado, cancelado, renovado, falha de pagamento)
 * para auditoria, dunning, contabilidade.
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
      planId: {
        type: String,
        enum: ['free', 'pro', 'premium'],
        required: true,
      },
      event: {
        type: String,
        required: true,
        enum: [
          'checkout_created',
          'subscription_created',
          'subscription_activated',
          'subscription_canceled',
          'subscription_renewed',
          'payment_failed',
          'payment_succeeded',
          'plan_changed',
        ],
        index: true,
      },
      stripeCustomerId: { type: String },
      stripeSubscriptionId: { type: String, index: true },
      stripeCheckoutSessionId: { type: String },
      stripeInvoiceId: { type: String },
      amount: { type: Number }, // valor em centavos
      currency: { type: String, default: 'brl' },
      // Payload bruto do webhook (útil pra debug)
      raw: {
        type: mongoose.Schema.Types.Mixed,
        select: false,
      },
    },
    { timestamps: true }
  );

  module.schema.index({ user: 1, createdAt: -1 });
};
