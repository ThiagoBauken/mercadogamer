// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';
import { addMessageToToast, endpoints, get } from '@utils';
import { ThemeColor } from '@theme/color';
import moment from 'moment';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DisputePending {
  _id: string;
  id: string;
  order: { number: number; pricePaid: number };
  buyer: { username: string };
  seller: { username: string };
  reason: string;
  status: string;
  createdAt: string;
}

// ─── Styled Components ────────────────────────────────────────────────────────

const PageWrapper = styled.section`
  padding: 24px;
  max-width: 900px;
`;

const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
`;

const PageSubtitle = styled.p`
  font-size: 14px;
  color: ${ThemeColor['gray-50']};
  margin: 0 0 24px 0;
`;

const DisputeCard = styled.div`
  background: ${ThemeColor['gray-110']};
  border: 1px solid ${ThemeColor['gray-90']};
  border-radius: 12px;
  padding: 18px 22px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: border-color 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  &:hover {
    border-color: ${ThemeColor.violet};
  }
`;

const CardLeft = styled.div`
  flex: 1;
`;

const OrderNum = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
`;

const CardMeta = styled.div`
  font-size: 13px;
  color: ${ThemeColor['gray-50']};
  margin-bottom: 4px;
`;

const CardRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
`;

const AdminBadge = styled.span`
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 700;
  background: rgba(113,47,255,0.15);
  color: ${ThemeColor.violet};
`;

const CardValue = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${ThemeColor['gray-30']};
`;

const CardDate = styled.div`
  font-size: 12px;
  color: ${ThemeColor['gray-60']};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${ThemeColor['gray-50']};
  font-size: 15px;
`;

const LoadingText = styled.div`
  padding: 40px 0;
  color: ${ThemeColor['gray-50']};
  font-size: 14px;
`;

// ─── Component ────────────────────────────────────────────────────────────────

export const DisputasAdminContent: React.FC = () => {
  const { t } = useTranslation('disputes');
  const router = useRouter();

  const [disputes, setDisputes] = useState<DisputePending[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPending = async () => {
    try {
      setLoading(true);
      const res = await get(endpoints.disputeAdminPendingUrl);
      const data = res.data?.data || res.data || [];
      setDisputes(Array.isArray(data) ? data : []);
    } catch {
      addMessageToToast(t('errors.load'), { status: 'error', icon: 'alert-triangle' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <PageTitle>Disputas pendentes (Admin)</PageTitle>
        <LoadingText>{t('loading')}</LoadingText>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageTitle>Disputas pendentes (Admin)</PageTitle>
      <PageSubtitle>
        {disputes.length} disputa{disputes.length !== 1 ? 's' : ''} aguardando revisão
      </PageSubtitle>

      {disputes.length === 0 ? (
        <EmptyState>Nenhuma disputa pendente de revisão.</EmptyState>
      ) : (
        disputes.map((dispute) => (
          <DisputeCard
            key={dispute._id || dispute.id}
            onClick={() => router.push(`/dashboard/disputas/${dispute._id || dispute.id}`)}
          >
            <CardLeft>
              <OrderNum>Pedido #{dispute.order?.number || '—'}</OrderNum>
              <CardMeta>
                Comprador: {dispute.buyer?.username} · Vendedor: {dispute.seller?.username}
              </CardMeta>
              <CardMeta>{t(`reason.${dispute.reason}`)}</CardMeta>
            </CardLeft>
            <CardRight>
              <AdminBadge>{t('status.admin_review')}</AdminBadge>
              {dispute.order?.pricePaid != null && (
                <CardValue>R$ {Number(dispute.order.pricePaid).toFixed(2)}</CardValue>
              )}
              <CardDate>{moment(dispute.createdAt).format('DD/MM/YYYY')}</CardDate>
            </CardRight>
          </DisputeCard>
        ))
      )}
    </PageWrapper>
  );
};
