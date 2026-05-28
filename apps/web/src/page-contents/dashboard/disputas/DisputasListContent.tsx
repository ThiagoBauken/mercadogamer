// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';
import { useTypedSelector } from '@store';
import { addMessageToToast, endpoints, get } from '@utils';
import { ThemeColor } from '@theme/color';
import moment from 'moment';

// ─── Types ────────────────────────────────────────────────────────────────────

type DisputeStatus =
  | 'open'
  | 'awaiting_seller'
  | 'awaiting_buyer'
  | 'admin_review'
  | 'resolved_buyer'
  | 'resolved_seller'
  | 'cancelled';

type DisputeReason = 'not_received' | 'not_working' | 'fake' | 'chargeback' | 'other';

interface DisputeItem {
  _id: string;
  id: string;
  order: { number: number; status: string; pricePaid: number };
  buyer: { username: string; emailAddress: string };
  seller: { username: string; emailAddress: string };
  reason: DisputeReason;
  status: DisputeStatus;
  createdAt: string;
}

type FilterTab = 'all' | 'open' | 'closed';

const OPEN_STATUSES: DisputeStatus[] = ['open', 'awaiting_seller', 'awaiting_buyer', 'admin_review'];
const CLOSED_STATUSES: DisputeStatus[] = ['resolved_buyer', 'resolved_seller', 'cancelled'];

const statusColor = (status: DisputeStatus): string => {
  if (OPEN_STATUSES.includes(status)) return ThemeColor.primary;
  if (status === 'resolved_buyer' || status === 'resolved_seller') return ThemeColor.positive;
  return ThemeColor['gray-60'];
};

const statusBg = (status: DisputeStatus): string => {
  if (OPEN_STATUSES.includes(status)) return 'rgba(247,138,14,0.15)';
  if (status === 'resolved_buyer' || status === 'resolved_seller') return 'rgba(60,255,42,0.12)';
  return 'rgba(115,119,138,0.15)';
};

// ─── Styled Components ────────────────────────────────────────────────────────

const PageWrapper = styled.section`
  padding: 24px;
  max-width: 900px;
`;

const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 20px 0;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const FilterChip = styled.button<{ $active: boolean }>`
  padding: 6px 18px;
  border-radius: 99px;
  border: 1px solid ${({ $active }) => ($active ? ThemeColor.primary : ThemeColor['gray-80'])};
  background: ${({ $active }) => ($active ? 'rgba(247,138,14,0.15)' : 'transparent')};
  color: ${({ $active }) => ($active ? ThemeColor.primary : ThemeColor['gray-40'])};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${ThemeColor.primary};
    color: ${ThemeColor.primary};
  }
`;

const DisputeCard = styled.div`
  background: ${ThemeColor['gray-110']};
  border: 1px solid ${ThemeColor['gray-90']};
  border-radius: 12px;
  padding: 18px 22px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  &:hover {
    border-color: ${ThemeColor.primary};
    background: ${ThemeColor['gray-100']};
  }
`;

const CardLeft = styled.div`
  flex: 1;
  min-width: 0;
`;

const CardOrderNumber = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
`;

const CardMeta = styled.div`
  font-size: 13px;
  color: ${ThemeColor['gray-50']};
  margin-bottom: 6px;
`;

const CardReason = styled.div`
  font-size: 13px;
  color: ${ThemeColor['gray-40']};
`;

const CardRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  white-space: nowrap;
`;

const StatusBadge = styled.span<{ $status: DisputeStatus }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ $status }) => statusBg($status)};
  color: ${({ $status }) => statusColor($status)};
`;

const CardDate = styled.div`
  font-size: 12px;
  color: ${ThemeColor['gray-60']};
`;

const CardValue = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${ThemeColor['gray-30']};
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

export const DisputasListContent: React.FC = () => {
  const { t } = useTranslation('disputes');
  const router = useRouter();
  const { auth: { user } } = useTypedSelector((store) => store);

  const [disputes, setDisputes] = useState<DisputeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>('all');

  useEffect(() => {
    loadDisputes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDisputes = async () => {
    try {
      setLoading(true);
      const res = await get(endpoints.disputeMineUrl);
      const data = res.data?.data || res.data || [];
      setDisputes(Array.isArray(data) ? data : []);
    } catch {
      addMessageToToast(t('errors.load'), { status: 'error', icon: 'alert-triangle' });
    } finally {
      setLoading(false);
    }
  };

  const filteredDisputes = disputes.filter((d) => {
    if (filter === 'all') return true;
    if (filter === 'open') return OPEN_STATUSES.includes(d.status);
    if (filter === 'closed') return CLOSED_STATUSES.includes(d.status);
    return true;
  });

  const getCounterpart = (dispute: DisputeItem): string => {
    if (!user) return '—';
    const isBuyer = user.id === (dispute.buyer as any)?._id || user.id === (dispute.buyer as any)?.id || user.username === dispute.buyer?.username;
    return isBuyer
      ? (dispute.seller?.username || '—')
      : (dispute.buyer?.username || '—');
  };

  const handleCardClick = (dispute: DisputeItem) => {
    router.push(`/dashboard/disputas/${dispute._id || dispute.id}`);
  };

  if (loading) {
    return (
      <PageWrapper>
        <PageTitle>{t('title')}</PageTitle>
        <LoadingText>{t('loading')}</LoadingText>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageTitle>{t('title')}</PageTitle>

      <FilterRow>
        <FilterChip $active={filter === 'all'} onClick={() => setFilter('all')}>
          {t('filter.all')}
        </FilterChip>
        <FilterChip $active={filter === 'open'} onClick={() => setFilter('open')}>
          {t('filter.open')}
        </FilterChip>
        <FilterChip $active={filter === 'closed'} onClick={() => setFilter('closed')}>
          {t('filter.closed')}
        </FilterChip>
      </FilterRow>

      {filteredDisputes.length === 0 ? (
        <EmptyState>{t('empty')}</EmptyState>
      ) : (
        filteredDisputes.map((dispute) => (
          <DisputeCard key={dispute._id || dispute.id} onClick={() => handleCardClick(dispute)}>
            <CardLeft>
              <CardOrderNumber>
                {t('detail.order')} #{dispute.order?.number || '—'}
              </CardOrderNumber>
              <CardMeta>
                {t('counterpart')}: {getCounterpart(dispute)}
              </CardMeta>
              <CardReason>{t(`reason.${dispute.reason}`)}</CardReason>
            </CardLeft>
            <CardRight>
              <StatusBadge $status={dispute.status}>
                {t(`status.${dispute.status}`)}
              </StatusBadge>
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
