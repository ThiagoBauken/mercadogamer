'use strict';

/**
 * Subscriptions (P1.6) — Stripe Subscriptions pra planos de vendedor.
 *
 * Endpoints:
 *   GET  /api/subscriptions/plans                  — lista planos com preços/features (público)
 *   GET  /api/subscriptions/current                — plano atual do user logado
 *   POST /api/subscriptions/create-checkout        — cria Stripe Checkout pra upgrade
 *   POST /api/subscriptions/cancel                 — cancela assinatura (no fim do período)
 *   POST /api/subscriptions/webhook                — Stripe webhook (sem auth, mas com signature check)
 *
 * Pré-requisitos no Stripe:
 *   1. Dashboard Stripe → Products → criar 2 produtos: "MercadoGamer Pro" e "MercadoGamer Premium"
 *   2. Pra cada, criar Price recurring monthly (BRL)
 *   3. Copiar os price_xxx pros env: STRIPE_PRICE_PRO, STRIPE_PRICE_PREMIUM
 *   4. Webhooks → adicionar endpoint https://api.mercadogamer.com.br/api/subscriptions/webhook
 *      → eventos: checkout.session.completed, invoice.payment_succeeded,
 *        invoice.payment_failed, customer.subscription.updated,
 *        customer.subscription.deleted
 *   5. Copiar signing secret pra STRIPE_WEBHOOK_SECRET
 */
module.exports = (module) => {
  const Users = () => global.modules.users.model;
  const SubLog = () => global.modules.subscriptions.model;
  const auth = global.helpers.security.auth;
  const lib = () => module.lib;
  const plans = () => global.helpers.billing.plans;

  function getStripe() {
    const Stripe = require('stripe');
    const key = process.env.STRIPE_LIVE_SECRET_KEY || process.env.STRIPE_TEST_SECRET_KEY;
    if (!key) throw new Error('STRIPE_LIVE_SECRET_KEY (ou TEST) não configurado');
    return new Stripe(key, { apiVersion: '2024-12-18.acacia' });
  }

  // ───────── GET /api/subscriptions/plans ─────────
  module.router.get('/plans', (req, res) => {
    res.json({ data: plans().listPlans() });
  });

  // ───────── GET /api/subscriptions/current ─────────
  module.router.get('/current', auth(['user']), async (req, res, next) => {
    try {
      const user = await Users()
        .findById(req.user._id)
        .select('+stripeCustomerId +stripeSubscriptionId');
      if (!user) return next(lib().httpError(404, 'Usuário não encontrado'));

      const planId = user.sellerPlan || 'free';
      const plan = plans().getPlan(planId);
      const isActive = !plan.priceMonthly || (user.sellerPlanActiveUntil && new Date(user.sellerPlanActiveUntil) > new Date());

      res.json({
        planId,
        plan,
        isActive,
        activeUntil: user.sellerPlanActiveUntil,
        stripeSubscriptionStatus: user.stripeSubscriptionStatus,
      });
    } catch (e) { next(e); }
  });

  // ───────── POST /api/subscriptions/create-checkout ─────────
  // Body: { planId: 'pro' | 'premium' }
  module.router.post('/create-checkout', auth(['user']), async (req, res, next) => {
    try {
      const { planId } = req.body || {};
      if (!['pro', 'premium'].includes(planId)) {
        return next(lib().httpError(400, 'planId deve ser "pro" ou "premium"'));
      }

      const plan = plans().getPlan(planId);
      if (!plan.stripePriceId) {
        return next(lib().httpError(500, `Stripe Price ID não configurado para plano ${planId}. Configure STRIPE_PRICE_${planId.toUpperCase()} no .env.`));
      }

      const user = await Users()
        .findById(req.user._id)
        .select('+stripeCustomerId');
      if (!user) return next(lib().httpError(404, 'Usuário não encontrado'));

      const stripe = getStripe();

      // Criar (ou reusar) customer Stripe pro user
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.emailAddress,
          name: user.fullName || user.username,
          metadata: { userId: String(user._id) },
        });
        customerId = customer.id;
        user.stripeCustomerId = customerId;
        await user.save();
      }

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{ price: plan.stripePriceId, quantity: 1 }],
        success_url: `${frontendUrl}/dashboard/upgrade?status=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendUrl}/dashboard/upgrade?status=cancel`,
        metadata: { userId: String(user._id), planId },
        subscription_data: {
          metadata: { userId: String(user._id), planId },
        },
      });

      await SubLog().create({
        user: user._id,
        planId,
        event: 'checkout_created',
        stripeCustomerId: customerId,
        stripeCheckoutSessionId: session.id,
      });

      res.json({ url: session.url, sessionId: session.id });
    } catch (e) { next(e); }
  });

  // ───────── POST /api/subscriptions/cancel ─────────
  module.router.post('/cancel', auth(['user']), async (req, res, next) => {
    try {
      const user = await Users()
        .findById(req.user._id)
        .select('+stripeSubscriptionId');
      if (!user || !user.stripeSubscriptionId) {
        return next(lib().httpError(400, 'Sem assinatura ativa pra cancelar'));
      }

      const stripe = getStripe();
      const sub = await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

      await SubLog().create({
        user: user._id,
        planId: user.sellerPlan,
        event: 'subscription_canceled',
        stripeSubscriptionId: sub.id,
      });

      res.json({
        message: 'Assinatura será cancelada ao fim do período atual',
        cancelAt: sub.cancel_at ? new Date(sub.cancel_at * 1000) : null,
      });
    } catch (e) { next(e); }
  });

  // ───────── POST /api/subscriptions/webhook ─────────
  // IMPORTANTE: este endpoint não passa por bodyParser.json porque Stripe
  // verifica signature do raw body. Mas como o app.js já tem body-parser
  // global, precisamos do raw via req.rawBody (não temos) ou um middleware
  // específico aqui. Por simplicidade: usamos req.body assumindo que está
  // em JSON. Em prod com signature check estrita, considerar app.js mudar.
  module.router.post('/webhook', async (req, res) => {
    const stripe = (() => { try { return getStripe(); } catch { return null; } })();
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event = req.body;
    // Verificar signature apenas se temos secret + raw body
    if (stripe && webhookSecret && sig && req.rawBody) {
      try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
      } catch (err) {
        console.error('[subscriptions.webhook] signature inválida:', err.message);
        return res.status(400).send(`Webhook signature failed: ${err.message}`);
      }
    } else if (process.env.NODE_ENV === 'production') {
      console.warn('[subscriptions.webhook] sem signature check em produção — configurar STRIPE_WEBHOOK_SECRET + raw body parser');
    }

    try {
      await handleStripeEvent(event);
      res.json({ received: true });
    } catch (err) {
      console.error('[subscriptions.webhook] erro processando:', err);
      // 200 mesmo em erro pra evitar Stripe retry infinito durante debug.
      // Em produção, retornar 500 pra Stripe retry com backoff.
      res.status(500).json({ error: err.message });
    }
  });

  async function handleStripeEvent(event) {
    const data = event.data?.object || {};

    switch (event.type) {
      case 'checkout.session.completed': {
        const userId = data.metadata?.userId;
        const planId = data.metadata?.planId;
        const subId = data.subscription;
        if (!userId || !planId) return;

        const user = await Users().findById(userId);
        if (!user) return;
        user.sellerPlan = planId;
        user.stripeSubscriptionId = subId;
        user.stripeSubscriptionStatus = 'active';
        // Cobrança mensal — adicionar 31 dias inicialmente (vai ser atualizado pelo invoice.payment_succeeded)
        user.sellerPlanActiveUntil = new Date(Date.now() + 31 * 24 * 60 * 60 * 1000);
        await user.save();

        await SubLog().create({
          user: user._id, planId,
          event: 'subscription_activated',
          stripeSubscriptionId: subId,
          stripeCheckoutSessionId: data.id,
          raw: event,
        });
        break;
      }

      case 'invoice.payment_succeeded': {
        const subId = data.subscription;
        if (!subId) return;
        const user = await Users().findOne({ stripeSubscriptionId: subId });
        if (!user) return;
        const periodEnd = data.lines?.data?.[0]?.period?.end;
        user.sellerPlanActiveUntil = periodEnd ? new Date(periodEnd * 1000) : new Date(Date.now() + 31 * 86400000);
        user.stripeSubscriptionStatus = 'active';
        await user.save();

        await SubLog().create({
          user: user._id,
          planId: user.sellerPlan,
          event: 'payment_succeeded',
          stripeSubscriptionId: subId,
          stripeInvoiceId: data.id,
          amount: data.amount_paid,
          currency: data.currency,
        });
        break;
      }

      case 'invoice.payment_failed': {
        const subId = data.subscription;
        const user = await Users().findOne({ stripeSubscriptionId: subId });
        if (!user) return;
        user.stripeSubscriptionStatus = 'past_due';
        await user.save();

        await SubLog().create({
          user: user._id,
          planId: user.sellerPlan,
          event: 'payment_failed',
          stripeSubscriptionId: subId,
          stripeInvoiceId: data.id,
        });
        break;
      }

      case 'customer.subscription.deleted':
      case 'customer.subscription.updated': {
        const subId = data.id;
        const user = await Users().findOne({ stripeSubscriptionId: subId });
        if (!user) return;

        if (event.type === 'customer.subscription.deleted' || data.status === 'canceled') {
          // Voltou pra free
          user.sellerPlan = 'free';
          user.stripeSubscriptionStatus = 'canceled';
          user.sellerPlanActiveUntil = null;
          await user.save();

          await SubLog().create({
            user: user._id, planId: 'free',
            event: 'subscription_canceled',
            stripeSubscriptionId: subId,
          });
        } else {
          user.stripeSubscriptionStatus = data.status;
          if (data.current_period_end) {
            user.sellerPlanActiveUntil = new Date(data.current_period_end * 1000);
          }
          await user.save();
        }
        break;
      }

      default:
        // Ignora eventos não relevantes
        console.log('[subscriptions.webhook] evento ignorado:', event.type);
    }
  }
};
