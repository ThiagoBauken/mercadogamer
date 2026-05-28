// @ts-nocheck
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';
import { get, post, endpoints, addMessageToToast } from '@utils';

interface PlanFeature {
  id: 'free' | 'pro' | 'premium';
  name: string;
  priceMonthly: number;
  commissionRate: number;
  maxListings: number;
  featuredSlots: number;
  badge: string | null;
  analytics: boolean;
  prioritySupport: boolean;
  description: string;
  features: string[];
}

interface CurrentSub {
  planId: 'free' | 'pro' | 'premium';
  plan: PlanFeature;
  isActive: boolean;
  activeUntil?: string;
  stripeSubscriptionStatus?: string;
}

const Wrapper = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const PageSubtitle = styled.p`
  font-size: 15px;
  color: #666;
  margin-bottom: 32px;
`;

const Banner = styled.div<{ kind?: 'success' | 'info' | 'warning' }>`
  background: ${(p) =>
    p.kind === 'success' ? '#e8f5e9' : p.kind === 'warning' ? '#fff8e1' : '#e3f2fd'};
  border-left: 4px solid
    ${(p) => (p.kind === 'success' ? '#43a047' : p.kind === 'warning' ? '#fb8c00' : '#1976d2')};
  padding: 16px 20px;
  border-radius: 6px;
  margin-bottom: 24px;
  font-size: 14px;
`;

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const Card = styled.div<{ recommended?: boolean; current?: boolean }>`
  border: 2px solid ${(p) => (p.recommended ? '#1976d2' : p.current ? '#43a047' : '#e0e0e0')};
  border-radius: 12px;
  padding: 24px;
  background: #fff;
  position: relative;
  display: flex;
  flex-direction: column;

  &::before {
    content: ${(p) =>
      p.recommended ? "'⭐ Mais escolhido'" : p.current ? "'✅ Plano atual'" : "''"};
    display: ${(p) => (p.recommended || p.current ? 'block' : 'none')};
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: ${(p) => (p.recommended ? '#1976d2' : '#43a047')};
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 12px;
    white-space: nowrap;
  }
`;

const PlanName = styled.h2`
  font-size: 22px;
  font-weight: 700;
  margin: 4px 0;
`;

const Price = styled.div`
  font-size: 32px;
  font-weight: 700;
  margin: 12px 0;
  color: #1976d2;

  small {
    font-size: 14px;
    font-weight: 400;
    color: #888;
  }
`;

const Desc = styled.p`
  font-size: 14px;
  color: #555;
  min-height: 60px;
  margin-bottom: 16px;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
  flex: 1;

  li {
    padding: 6px 0;
    font-size: 14px;
    color: #333;

    &::before {
      content: '✓ ';
      color: #43a047;
      font-weight: 700;
      margin-right: 4px;
    }
  }
`;

const CTA = styled.button<{ primary?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  background: ${(p) => (p.primary ? '#1976d2' : '#f5f5f5')};
  color: ${(p) => (p.primary ? '#fff' : '#333')};
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelLink = styled.button`
  background: none;
  border: none;
  color: #d32f2f;
  text-decoration: underline;
  font-size: 13px;
  cursor: pointer;
  margin-top: 8px;
  padding: 0;
`;

export const UpgradeContent: React.FC = () => {
  const { t } = useTranslation('upgrade');
  const router = useRouter();

  const [plans, setPlans] = useState<PlanFeature[]>([]);
  const [current, setCurrent] = useState<CurrentSub | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [plansRes, currentRes] = await Promise.all([
          get(endpoints.subscriptionsPlansUrl).catch(() => null),
          get(endpoints.subscriptionsCurrentUrl).catch(() => null),
        ]);
        if (plansRes) setPlans(plansRes.data?.data || []);
        if (currentRes) setCurrent(currentRes.data || null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Stripe checkout redirect status
  useEffect(() => {
    if (router.query.status === 'success') {
      addMessageToToast(
        t('checkout_success') || 'Assinatura ativada! Pode levar até 1min pra refletir.',
        { status: 'success', icon: 'check-circle' }
      );
    } else if (router.query.status === 'cancel') {
      addMessageToToast(t('checkout_cancel') || 'Checkout cancelado.', {
        status: 'info',
        icon: 'info',
      });
    }
  }, [router.query.status]);

  const handleSubscribe = async (planId: 'pro' | 'premium') => {
    setCheckingOut(planId);
    try {
      const res = await post(endpoints.subscriptionsCreateCheckoutUrl, { planId });
      const url = res.data?.url;
      if (url) {
        window.location.href = url;
      } else {
        addMessageToToast(t('checkout_error') || 'Erro ao criar checkout', { status: 'error' });
        setCheckingOut(null);
      }
    } catch (err: any) {
      addMessageToToast(err?.response?.data?.message || t('checkout_error') || 'Erro', {
        status: 'error',
      });
      setCheckingOut(null);
    }
  };

  const handleCancel = async () => {
    if (!confirm(t('cancel_confirm') || 'Cancelar assinatura no fim do período atual?')) return;
    try {
      await post(endpoints.subscriptionsCancelUrl, {});
      addMessageToToast(t('cancel_success') || 'Assinatura será cancelada no fim do período.', {
        status: 'success',
      });
      const cur = await get(endpoints.subscriptionsCurrentUrl).catch(() => null);
      if (cur) setCurrent(cur.data || null);
    } catch (err: any) {
      addMessageToToast(err?.response?.data?.message || 'Erro ao cancelar', { status: 'error' });
    }
  };

  if (loading) {
    return (
      <Wrapper>
        <PageTitle>{t('title') || 'Planos de vendedor'}</PageTitle>
        <p>{t('loading') || 'Carregando…'}</p>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <PageTitle>{t('title') || 'Escolha seu plano de vendedor'}</PageTitle>
      <PageSubtitle>
        {t('subtitle') ||
          'Pague menos comissão, anuncie mais produtos e ganhe selos visíveis para os compradores.'}
      </PageSubtitle>

      {current?.planId !== 'free' && current?.isActive && (
        <Banner kind="success">
          ✅ {t('current_banner_active') || 'Seu plano'} <strong>{current?.plan?.name}</strong>{' '}
          {t('current_banner_active_until') || 'está ativo até'}{' '}
          <strong>
            {current?.activeUntil
              ? new Date(current.activeUntil).toLocaleDateString('pt-BR')
              : '—'}
          </strong>
          .{' '}
          <CancelLink onClick={handleCancel}>
            {t('cancel_link') || 'Cancelar assinatura'}
          </CancelLink>
        </Banner>
      )}

      {current?.stripeSubscriptionStatus === 'past_due' && (
        <Banner kind="warning">
          ⚠️ {t('past_due_banner') || 'Última cobrança falhou. Atualize seu cartão pra manter o plano ativo.'}
        </Banner>
      )}

      <Cards>
        {plans.map((plan) => {
          const isCurrent = current?.planId === plan.id;
          const isRecommended = plan.id === 'pro';
          return (
            <Card key={plan.id} recommended={isRecommended} current={isCurrent}>
              <PlanName>{plan.name}</PlanName>
              <Price>
                {plan.priceMonthly === 0 ? (
                  t('free_label') || 'Grátis'
                ) : (
                  <>
                    R$ {plan.priceMonthly.toFixed(2).replace('.', ',')}
                    <small> /{t('month') || 'mês'}</small>
                  </>
                )}
              </Price>
              <Desc>{plan.description}</Desc>
              <FeatureList>
                {plan.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </FeatureList>

              {plan.id === 'free' ? (
                <CTA disabled>
                  {isCurrent ? t('your_plan') || 'Seu plano atual' : t('free_plan') || 'Plano gratuito'}
                </CTA>
              ) : isCurrent ? (
                <CTA disabled>{t('your_plan') || 'Seu plano atual'}</CTA>
              ) : (
                <CTA
                  primary
                  disabled={!!checkingOut}
                  onClick={() => handleSubscribe(plan.id as 'pro' | 'premium')}
                >
                  {checkingOut === plan.id
                    ? t('redirecting') || 'Redirecionando…'
                    : current?.planId === 'free'
                    ? t('subscribe') || 'Assinar'
                    : t('change_plan') || 'Mudar pra este plano'}
                </CTA>
              )}
            </Card>
          );
        })}
      </Cards>

      <Banner kind="info">
        💳 {t('payment_info') ||
          'Pagamento processado pelo Stripe. Cobrança mensal recorrente em cartão de crédito. Cancele quando quiser — sem fidelidade.'}
      </Banner>
    </Wrapper>
  );
};

export default UpgradeContent;
