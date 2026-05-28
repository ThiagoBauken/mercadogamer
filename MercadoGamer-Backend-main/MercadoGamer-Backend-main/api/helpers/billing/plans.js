'use strict';

/**
 * Catálogo de planos de vendedor (P1.6).
 *
 * Importante:
 *   - `stripePriceId` precisa ser criado no dashboard Stripe (Products → add product
 *     → recurring monthly). Cole o `price_xxx` aqui ou no env.
 *   - `commissionRate` é a fração que a plataforma fica de cada venda.
 *   - `maxListings` = limite de produtos ativos por vendedor.
 *   - `featuredSlots` = quantos produtos podem ficar destacados na home.
 *
 * Estratégia de monetização (sugerida):
 *   - free: 10% comissão + 10 anúncios → captura casual
 *   - pro: 7% + 100 anúncios + 3 destaques + selo → seller sério
 *   - premium: 5% + ilimitado + 10 destaques + analytics → power seller
 *
 * Receita esperada:
 *   - 80% dos sellers free (R$ 0/mês mas paga comissão de 10%)
 *   - 15% pro (R$ 29.90/mês = R$ 358/ano)
 *   - 5% premium (R$ 99.90/mês = R$ 1198/ano)
 *
 *   Em 1000 sellers: 150 pro × R$ 29.90 + 50 premium × R$ 99.90 = R$ 9.480/mês recorrente
 *                    (sem contar comissão de vendas)
 */

const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    priceMonthly: 0,
    stripePriceId: null, // não é Stripe — assinatura mensal não cobrada
    commissionRate: 0.10, // 10%
    maxListings: 10,
    featuredSlots: 0,
    badge: null,
    analytics: false,
    prioritySupport: false,
    description: 'Comece a vender sem custo fixo. 10% de comissão por venda.',
    features: [
      '10 produtos ativos',
      'Comissão de 10% por venda',
      'Suporte por email',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 29.90,
    stripePriceId: process.env.STRIPE_PRICE_PRO || null,
    commissionRate: 0.07, // 7%
    maxListings: 100,
    featuredSlots: 3,
    badge: 'pro',
    analytics: true,
    prioritySupport: false,
    description: 'Cresça mais rápido com menos comissão, mais anúncios e selo Pro.',
    features: [
      '100 produtos ativos',
      'Comissão de 7% por venda (economize 30%)',
      '3 destaques na home',
      'Selo Pro visível pros compradores',
      'Dashboard de analytics',
    ],
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    priceMonthly: 99.90,
    stripePriceId: process.env.STRIPE_PRICE_PREMIUM || null,
    commissionRate: 0.05, // 5%
    maxListings: -1, // -1 = ilimitado
    featuredSlots: 10,
    badge: 'premium',
    analytics: true,
    prioritySupport: true,
    description: 'Para vendedores profissionais. Ilimitado + suporte prioritário.',
    features: [
      'Anúncios ilimitados',
      'Comissão de 5% por venda (economize 50%)',
      '10 destaques na home',
      'Selo Premium dourado',
      'Dashboard de analytics completo',
      'Suporte prioritário (resposta em 4h)',
    ],
  },
};

function getPlan(planId) {
  return PLANS[planId] || PLANS.free;
}

function listPlans() {
  return Object.values(PLANS);
}

/**
 * Calcula a comissão da plataforma sobre uma venda.
 * Recebe o user (seller) e o valor da venda, retorna o valor da comissão.
 */
function calculateCommission(seller, saleAmount) {
  const plan = getPlan(seller?.sellerPlan);
  // Se a assinatura expirou, cai pra free
  const now = new Date();
  const isActive = seller?.sellerPlanActiveUntil && new Date(seller.sellerPlanActiveUntil) > now;
  const effectivePlan = isActive ? plan : PLANS.free;
  return Math.round(saleAmount * effectivePlan.commissionRate * 100) / 100;
}

function canAddListing(seller, currentListingCount) {
  const plan = getPlan(seller?.sellerPlan);
  const isActive = !plan.priceMonthly || (seller?.sellerPlanActiveUntil && new Date(seller.sellerPlanActiveUntil) > new Date());
  const effectivePlan = isActive ? plan : PLANS.free;
  if (effectivePlan.maxListings === -1) return true;
  return currentListingCount < effectivePlan.maxListings;
}

module.exports = (helper) => ({
  PLANS,
  getPlan,
  listPlans,
  calculateCommission,
  canAddListing,
});
