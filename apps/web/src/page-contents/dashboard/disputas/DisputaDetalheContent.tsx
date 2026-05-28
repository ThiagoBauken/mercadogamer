// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';
import { useTypedSelector } from '@store';
import { addMessageToToast, endpoints, get, post } from '@utils';
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

interface DisputeMessage {
  _id?: string;
  from: 'buyer' | 'seller' | 'admin';
  authorUser?: { username?: string };
  content: string;
  createdAt: string;
}

interface DisputeDetail {
  _id: string;
  id: string;
  order: { number: number; status: string; pricePaid: number };
  buyer: { _id?: string; id?: string; username: string; emailAddress: string };
  seller: { _id?: string; id?: string; username: string; emailAddress: string };
  reason: DisputeReason;
  description: string;
  status: DisputeStatus;
  messages: DisputeMessage[];
  evidence: string[];
  resolution?: {
    decision: string;
    reason: string;
    decidedAt: string;
    refundAmount?: number;
  };
  sellerResponseDeadline?: string;
  resolvedAt?: string;
  createdAt: string;
}

interface Props {
  id?: string;
}

const OPEN_STATUSES: DisputeStatus[] = ['open', 'awaiting_seller', 'awaiting_buyer', 'admin_review'];
const BUYER_CAN_CANCEL: DisputeStatus[] = ['open', 'awaiting_seller', 'awaiting_buyer', 'admin_review'];
const SELLER_CAN_RESPOND: DisputeStatus[] = ['open', 'awaiting_seller'];
const RESOLVED_STATUSES: DisputeStatus[] = ['resolved_buyer', 'resolved_seller', 'cancelled'];

const statusColor = (s: DisputeStatus) => {
  if (OPEN_STATUSES.includes(s)) return ThemeColor.primary;
  if (s === 'resolved_buyer' || s === 'resolved_seller') return ThemeColor.positive;
  return ThemeColor['gray-60'];
};
const statusBg = (s: DisputeStatus) => {
  if (OPEN_STATUSES.includes(s)) return 'rgba(247,138,14,0.15)';
  if (s === 'resolved_buyer' || s === 'resolved_seller') return 'rgba(60,255,42,0.12)';
  return 'rgba(115,119,138,0.15)';
};

const msgBgByRole = (from: string) => {
  if (from === 'buyer') return 'rgba(23,116,255,0.15)';
  if (from === 'seller') return 'rgba(247,138,14,0.12)';
  return 'rgba(113,47,255,0.15)';
};
const msgColorByRole = (from: string) => {
  if (from === 'buyer') return ThemeColor.blue;
  if (from === 'seller') return ThemeColor.primary;
  return ThemeColor.violet;
};

// ─── Styled Components ────────────────────────────────────────────────────────

const PageWrapper = styled.section`
  padding: 24px;
  max-width: 960px;
`;

const BackLink = styled.button`
  background: none;
  border: none;
  color: ${ThemeColor['gray-50']};
  font-size: 13px;
  cursor: pointer;
  padding: 0;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    color: ${ThemeColor.primary};
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

const PageTitle = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
`;

const StatusBadge = styled.span<{ $status: DisputeStatus }>`
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ $status }) => statusBg($status)};
  color: ${({ $status }) => statusColor($status)};
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MainCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SideCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Card = styled.div`
  background: ${ThemeColor['gray-110']};
  border: 1px solid ${ThemeColor['gray-90']};
  border-radius: 12px;
  padding: 20px;
`;

const CardTitle = styled.h2`
  font-size: 14px;
  font-weight: 700;
  color: ${ThemeColor['gray-40']};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 14px 0;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: ${ThemeColor['gray-50']};
  margin-bottom: 8px;
`;

const MetaValue = styled.span`
  color: ${ThemeColor['gray-20']};
  font-weight: 600;
  text-align: right;
  max-width: 60%;
  word-break: break-word;
`;

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 480px;
  overflow-y: auto;
  padding-right: 4px;
`;

const MessageBubble = styled.div<{ $from: string }>`
  background: ${({ $from }) => msgBgByRole($from)};
  border: 1px solid ${({ $from }) => msgColorByRole($from)}40;
  border-radius: 10px;
  padding: 12px 14px;
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

const MessageAuthor = styled.span<{ $from: string }>`
  font-size: 12px;
  font-weight: 700;
  color: ${({ $from }) => msgColorByRole($from)};
  text-transform: capitalize;
`;

const MessageTime = styled.span`
  font-size: 11px;
  color: ${ThemeColor['gray-60']};
`;

const MessageContent = styled.p`
  font-size: 14px;
  color: ${ThemeColor['gray-20']};
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
`;

const Textarea = styled.textarea`
  width: 100%;
  background: ${ThemeColor['gray-100']};
  border: 1px solid ${ThemeColor['gray-80']};
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  padding: 10px 14px;
  resize: vertical;
  min-height: 80px;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${ThemeColor.primary};
  }

  &::placeholder {
    color: ${ThemeColor['gray-60']};
  }
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'danger' | 'secondary' | 'success'; $loading?: boolean }>`
  width: 100%;
  padding: 10px 18px;
  border-radius: 50px;
  border: none;
  font-size: 14px;
  font-weight: 700;
  cursor: ${({ $loading }) => ($loading ? 'not-allowed' : 'pointer')};
  opacity: ${({ $loading }) => ($loading ? 0.7 : 1)};
  transition: opacity 0.2s;

  background: ${({ $variant }) => {
    if ($variant === 'danger') return ThemeColor.negative;
    if ($variant === 'secondary') return ThemeColor['gray-80'];
    if ($variant === 'success') return ThemeColor.positive;
    return ThemeColor.primary;
  }};
  color: ${({ $variant }) => ($variant === 'success' ? ThemeColor['gray-130'] : $variant === 'secondary' ? '#fff' : ThemeColor['gray-130'])};

  &:hover:not(:disabled) {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const ResolutionBox = styled.div`
  background: rgba(60, 255, 42, 0.08);
  border: 1px solid ${ThemeColor.positive};
  border-radius: 10px;
  padding: 16px;
`;

const ResolutionTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${ThemeColor.positive};
  margin-bottom: 10px;
`;

const ResolutionItem = styled.div`
  font-size: 13px;
  color: ${ThemeColor['gray-30']};
  margin-bottom: 6px;

  span {
    font-weight: 600;
    color: #fff;
  }
`;

const SectionLabel = styled.label`
  display: block;
  font-size: 12px;
  color: ${ThemeColor['gray-50']};
  margin-bottom: 6px;
  margin-top: 12px;
`;

const LoadingText = styled.div`
  padding: 40px 0;
  color: ${ThemeColor['gray-50']};
  font-size: 14px;
`;

const EmptyMessages = styled.div`
  text-align: center;
  padding: 24px;
  color: ${ThemeColor['gray-60']};
  font-size: 13px;
`;

// ─── Component ────────────────────────────────────────────────────────────────

export const DisputaDetalheContent: React.FC<Props> = ({ id: propId }) => {
  const { t } = useTranslation('disputes');
  const router = useRouter();
  const { auth: { user } } = useTypedSelector((store) => store);

  const [dispute, setDispute] = useState<DisputeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // message input
  const [newMsg, setNewMsg] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  // seller respond
  const [sellerResponse, setSellerResponse] = useState('');
  const [sendingResponse, setSendingResponse] = useState(false);

  // admin resolve
  const [adminReason, setAdminReason] = useState('');
  const [resolving, setResolving] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const disputeId = propId || (Array.isArray(router.query.id) ? router.query.id[0] : router.query.id);

  useEffect(() => {
    if (disputeId) loadDispute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disputeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dispute?.messages]);

  const loadDispute = async () => {
    try {
      setLoading(true);
      const res = await get(endpoints.disputeByIdUrl(disputeId));
      const data = res.data?.data || res.data;
      setDispute(data);
    } catch {
      addMessageToToast(t('errors.load'), { status: 'error', icon: 'alert-triangle' });
    } finally {
      setLoading(false);
    }
  };

  // ─── helpers ──────────────────────────────────────────────────────────────

  const isUserBuyer = () => {
    if (!user || !dispute) return false;
    return (
      user.id === dispute.buyer?._id ||
      user.id === dispute.buyer?.id ||
      user.username === dispute.buyer?.username
    );
  };

  const isUserSeller = () => {
    if (!user || !dispute) return false;
    return (
      user.id === dispute.seller?._id ||
      user.id === dispute.seller?.id ||
      user.username === dispute.seller?.username
    );
  };

  const isAdmin = () => {
    if (!user) return false;
    const roles = (user as any).roles;
    if (Array.isArray(roles)) return roles.includes('administrator');
    return roles === 'administrator';
  };

  // ─── actions ──────────────────────────────────────────────────────────────

  const handleSendMessage = async () => {
    if (!newMsg.trim()) return;
    try {
      setSendingMsg(true);
      await post(endpoints.disputeMessageUrl(disputeId), { content: newMsg.trim() });
      setNewMsg('');
      addMessageToToast(t('success.message'), { status: 'success', icon: 'check-circle' });
      await loadDispute();
    } catch {
      addMessageToToast(t('errors.generic'), { status: 'error', icon: 'alert-triangle' });
    } finally {
      setSendingMsg(false);
    }
  };

  const handleCancel = async () => {
    try {
      await post(endpoints.disputeCancelUrl(disputeId), {});
      addMessageToToast(t('success.cancelled'), { status: 'success', icon: 'check-circle' });
      await loadDispute();
    } catch {
      addMessageToToast(t('errors.generic'), { status: 'error', icon: 'alert-triangle' });
    }
  };

  const handleEscalate = async () => {
    try {
      await post(endpoints.disputeEscalateUrl(disputeId), {});
      addMessageToToast(t('success.escalated'), { status: 'success', icon: 'check-circle' });
      await loadDispute();
    } catch {
      addMessageToToast(t('errors.generic'), { status: 'error', icon: 'alert-triangle' });
    }
  };

  const handleSellerRespond = async () => {
    if (!sellerResponse.trim()) return;
    try {
      setSendingResponse(true);
      await post(endpoints.disputeRespondUrl(disputeId), { response: sellerResponse.trim() });
      setSellerResponse('');
      addMessageToToast(t('success.responded'), { status: 'success', icon: 'check-circle' });
      await loadDispute();
    } catch {
      addMessageToToast(t('errors.generic'), { status: 'error', icon: 'alert-triangle' });
    } finally {
      setSendingResponse(false);
    }
  };

  const handleAdminResolve = async (decision: 'refund_buyer' | 'release_seller') => {
    try {
      setResolving(true);
      await post(endpoints.disputeResolveUrl(disputeId), { decision, reason: adminReason.trim() || 'Decisão administrativa' });
      addMessageToToast(t('success.resolved'), { status: 'success', icon: 'check-circle' });
      await loadDispute();
    } catch {
      addMessageToToast(t('errors.generic'), { status: 'error', icon: 'alert-triangle' });
    } finally {
      setResolving(false);
    }
  };

  // ─── render ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <PageWrapper>
        <LoadingText>{t('loading')}</LoadingText>
      </PageWrapper>
    );
  }

  if (!dispute) {
    return (
      <PageWrapper>
        <LoadingText>{t('errors.load')}</LoadingText>
      </PageWrapper>
    );
  }

  const isBuyer = isUserBuyer();
  const isSeller = isUserSeller();
  const admin = isAdmin();
  const isResolved = RESOLVED_STATUSES.includes(dispute.status);

  return (
    <PageWrapper>
      <BackLink onClick={() => router.push('/dashboard/disputas')}>
        ← Voltar para disputas
      </BackLink>

      <HeaderRow>
        <PageTitle>
          {t('detail.order')} #{dispute.order?.number || '—'}
        </PageTitle>
        <StatusBadge $status={dispute.status}>
          {t(`status.${dispute.status}`)}
        </StatusBadge>
      </HeaderRow>

      <Layout>
        {/* ── Main column: messages ─────────────────────────────────── */}
        <MainCol>
          {/* Resolution block */}
          {dispute.resolution && (
            <ResolutionBox>
              <ResolutionTitle>{t('detail.resolution')}</ResolutionTitle>
              <ResolutionItem>
                {t('detail.adminDecision')}: <span>{dispute.resolution.decision}</span>
              </ResolutionItem>
              <ResolutionItem>
                {t('detail.adminReason')}: <span>{dispute.resolution.reason}</span>
              </ResolutionItem>
              {dispute.resolution.refundAmount != null && (
                <ResolutionItem>
                  {t('detail.refundAmount')}: <span>R$ {Number(dispute.resolution.refundAmount).toFixed(2)}</span>
                </ResolutionItem>
              )}
              <ResolutionItem>
                Data: <span>{moment(dispute.resolution.decidedAt).format('DD/MM/YYYY HH:mm')}</span>
              </ResolutionItem>
            </ResolutionBox>
          )}

          {/* Messages */}
          <Card>
            <CardTitle>{t('detail.messages')}</CardTitle>
            <MessagesContainer>
              {dispute.messages.length === 0 ? (
                <EmptyMessages>Nenhuma mensagem ainda.</EmptyMessages>
              ) : (
                dispute.messages.map((msg, idx) => (
                  <MessageBubble key={msg._id || idx} $from={msg.from}>
                    <MessageHeader>
                      <MessageAuthor $from={msg.from}>
                        {msg.from === 'admin' ? 'Admin' : msg.authorUser?.username || msg.from}
                      </MessageAuthor>
                      <MessageTime>{moment(msg.createdAt).format('DD/MM HH:mm')}</MessageTime>
                    </MessageHeader>
                    <MessageContent>{msg.content}</MessageContent>
                  </MessageBubble>
                ))
              )}
              <div ref={messagesEndRef} />
            </MessagesContainer>

            {/* New message input — visible to everyone while not resolved */}
            {!isResolved && (
              <div style={{ marginTop: '16px' }}>
                <SectionLabel>{t('detail.newMessage')}</SectionLabel>
                <Textarea
                  placeholder={t('detail.newMessage')}
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  rows={3}
                />
                <div style={{ marginTop: '10px' }}>
                  <ActionButton
                    $variant="primary"
                    $loading={sendingMsg}
                    disabled={sendingMsg || !newMsg.trim()}
                    onClick={handleSendMessage}
                  >
                    {sendingMsg ? 'Enviando...' : t('actions.send')}
                  </ActionButton>
                </div>
              </div>
            )}
          </Card>

          {/* Seller respond form */}
          {isSeller && SELLER_CAN_RESPOND.includes(dispute.status) && (
            <Card>
              <CardTitle>{t('detail.sellerResponse')}</CardTitle>
              <Textarea
                placeholder="Descreva sua resposta..."
                value={sellerResponse}
                onChange={(e) => setSellerResponse(e.target.value)}
                rows={4}
              />
              <div style={{ marginTop: '12px' }}>
                <ActionButton
                  $variant="primary"
                  $loading={sendingResponse}
                  disabled={sendingResponse || !sellerResponse.trim()}
                  onClick={handleSellerRespond}
                >
                  {sendingResponse ? 'Enviando...' : t('actions.respond')}
                </ActionButton>
              </div>
            </Card>
          )}

          {/* Admin resolve form */}
          {admin && dispute.status === 'admin_review' && (
            <Card>
              <CardTitle>Resolver disputa (Admin)</CardTitle>
              <SectionLabel>{t('detail.adminReason')}</SectionLabel>
              <Textarea
                placeholder="Motivo da decisão..."
                value={adminReason}
                onChange={(e) => setAdminReason(e.target.value)}
                rows={3}
              />
              <div style={{ marginTop: '12px', display: 'flex', gap: '10px', flexDirection: 'column' }}>
                <ActionButton
                  $variant="success"
                  $loading={resolving}
                  disabled={resolving}
                  onClick={() => handleAdminResolve('refund_buyer')}
                >
                  {t('actions.refundBuyer')}
                </ActionButton>
                <ActionButton
                  $variant="secondary"
                  $loading={resolving}
                  disabled={resolving}
                  onClick={() => handleAdminResolve('release_seller')}
                >
                  {t('actions.releaseSeller')}
                </ActionButton>
              </div>
            </Card>
          )}
        </MainCol>

        {/* ── Sidebar ───────────────────────────────────────────────── */}
        <SideCol>
          <Card>
            <CardTitle>Resumo</CardTitle>
            <MetaRow>
              <span>{t('detail.order')}</span>
              <MetaValue>#{dispute.order?.number}</MetaValue>
            </MetaRow>
            <MetaRow>
              <span>Motivo</span>
              <MetaValue>{t(`reason.${dispute.reason}`)}</MetaValue>
            </MetaRow>
            <MetaRow>
              <span>{t('detail.buyer')}</span>
              <MetaValue>{dispute.buyer?.username}</MetaValue>
            </MetaRow>
            <MetaRow>
              <span>{t('detail.seller')}</span>
              <MetaValue>{dispute.seller?.username}</MetaValue>
            </MetaRow>
            {dispute.order?.pricePaid != null && (
              <MetaRow>
                <span>{t('detail.amount')}</span>
                <MetaValue>R$ {Number(dispute.order.pricePaid).toFixed(2)}</MetaValue>
              </MetaRow>
            )}
            <MetaRow>
              <span>{t('detail.openedAt')}</span>
              <MetaValue>{moment(dispute.createdAt).format('DD/MM/YYYY')}</MetaValue>
            </MetaRow>
            {dispute.sellerResponseDeadline && !isResolved && (
              <MetaRow>
                <span>{t('detail.deadline')}</span>
                <MetaValue>{moment(dispute.sellerResponseDeadline).format('DD/MM HH:mm')}</MetaValue>
              </MetaRow>
            )}
          </Card>

          {/* Buyer actions */}
          {isBuyer && !isResolved && (
            <Card>
              <CardTitle>Ações</CardTitle>
              {dispute.status === 'awaiting_buyer' && (
                <ActionButton
                  $variant="secondary"
                  onClick={handleEscalate}
                  style={{ marginBottom: '10px' }}
                >
                  {t('actions.escalate')}
                </ActionButton>
              )}
              {BUYER_CAN_CANCEL.includes(dispute.status) && (
                <ActionButton $variant="danger" onClick={handleCancel}>
                  {t('actions.cancel')}
                </ActionButton>
              )}
            </Card>
          )}
        </SideCol>
      </Layout>
    </PageWrapper>
  );
};
