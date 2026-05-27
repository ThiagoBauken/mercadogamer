// @ts-nocheck - TypeScript compatibility fix
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';
import { useTypedSelector } from '@store';
import { addMessageToToast, endpoints, get, post } from '@utils';
import { ThemeColor } from '@theme/color';

// ─── Types ───────────────────────────────────────────────────────────────────

interface KycStatus {
  kycLevel: number;
  checklist: {
    email: boolean;
    phone: boolean;
    cpf: boolean;
  };
  canSell: boolean;
  canWithdraw: boolean;
}

// ─── Styled Components ───────────────────────────────────────────────────────

const PageWrapper = styled.section`
  padding: 24px;
  max-width: 900px;
`;

const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 6px 0;
`;

const PageSubtitle = styled.p`
  font-size: 14px;
  color: ${ThemeColor['gray-50']};
  margin: 0 0 24px 0;
`;

const SuccessBanner = styled.div`
  background: rgba(60, 255, 42, 0.1);
  border: 1px solid ${ThemeColor.positive};
  border-radius: 8px;
  padding: 14px 18px;
  color: ${ThemeColor.positive};
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 24px;
`;

const InfoBanner = styled.div`
  background: rgba(247, 138, 14, 0.1);
  border: 1px solid ${ThemeColor.primary};
  border-radius: 8px;
  padding: 14px 18px;
  color: ${ThemeColor.primary};
  font-size: 14px;
  margin-bottom: 24px;
`;

const ProgressBar = styled.div`
  margin-bottom: 28px;
`;

const ProgressLabel = styled.div`
  font-size: 13px;
  color: ${ThemeColor['gray-50']};
  margin-bottom: 8px;
`;

const ProgressTrack = styled.div`
  height: 6px;
  background: ${ThemeColor['gray-90']};
  border-radius: 99px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background: ${ThemeColor.primary};
  border-radius: 99px;
  transition: width 0.4s ease;
`;

const StepsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StepCard = styled.div<{ $disabled?: boolean; $done?: boolean }>`
  background: ${ThemeColor['gray-110']};
  border: 1px solid ${({ $done }) => ($done ? ThemeColor.positive : ThemeColor['gray-90'])};
  border-radius: 12px;
  padding: 20px 24px;
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  transition: border-color 0.3s;
`;

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
`;

const StepTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
`;

const DoneChip = styled.span`
  background: rgba(60, 255, 42, 0.15);
  color: ${ThemeColor.positive};
  font-size: 12px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 99px;
`;

const StepLabel = styled.p`
  font-size: 13px;
  color: ${ThemeColor['gray-50']};
  margin: 0 0 14px 0;
`;

const BlockedNote = styled.p`
  font-size: 13px;
  color: ${ThemeColor['gray-60']};
  margin: 4px 0 0 0;
  font-style: italic;
`;

const UserInfo = styled.p`
  font-size: 14px;
  color: ${ThemeColor['gray-30']};
  margin: 0 0 14px 0;
`;

const DevBox = styled.div`
  background: rgba(247, 210, 14, 0.12);
  border: 1px solid #f7d20e;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  color: #f7d20e;
  margin-bottom: 14px;
  word-break: break-all;
`;

const InputField = styled.input`
  width: 100%;
  background: ${ThemeColor['gray-100']};
  border: 1px solid ${ThemeColor['gray-80']};
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  padding: 10px 14px;
  margin-bottom: 12px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${ThemeColor.primary};
  }

  &::placeholder {
    color: ${ThemeColor['gray-60']};
  }
`;

const InputLabel = styled.label`
  display: block;
  font-size: 12px;
  color: ${ThemeColor['gray-50']};
  margin-bottom: 6px;
`;

const ActionButton = styled.button<{ $loading?: boolean }>`
  background: ${ThemeColor.primary};
  color: ${ThemeColor['gray-130']};
  border: none;
  border-radius: 50px;
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 700;
  cursor: ${({ $loading }) => ($loading ? 'not-allowed' : 'pointer')};
  opacity: ${({ $loading }) => ($loading ? 0.7 : 1)};
  transition: opacity 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

// ─── Component ───────────────────────────────────────────────────────────────

export const KycPageContent: React.FC = () => {
  const { t } = useTranslation('kyc');

  const { auth: { user } } = useTypedSelector((store) => store);

  // ── KYC status from backend ──
  const [kycStatus, setKycStatus] = useState<KycStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  // ── Step 1 — Email ──
  const [emailSent, setEmailSent] = useState(false);
  const [emailToken, setEmailToken] = useState('');
  const [devEmailLink, setDevEmailLink] = useState<string | null>(null);
  const [emailSending, setEmailSending] = useState(false);
  const [emailConfirming, setEmailConfirming] = useState(false);

  // ── Step 2 — Phone ──
  const [smsSent, setSmsSent] = useState(false);
  const [smsCode, setSmsCode] = useState('');
  const [devSmsCode, setDevSmsCode] = useState<string | null>(null);
  const [smsSending, setSmsSending] = useState(false);
  const [smsConfirming, setSmsConfirming] = useState(false);

  // ── Step 3 — CPF ──
  const [cpfValue, setCpfValue] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [cpfSubmitting, setCpfSubmitting] = useState(false);

  // ─── Helpers ───────────────────────────────────────────────────────────────

  const loadStatus = async () => {
    try {
      setLoadingStatus(true);
      const res = await get(endpoints.kycStatusUrl);
      setKycStatus(res.data);
    } catch (error) {
      addMessageToToast(t('errors.loadStatus'), { status: 'error', icon: 'alert-triangle' });
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    loadStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const extractTokenFromLink = (link: string): string => {
    try {
      const url = new URL(link);
      return url.searchParams.get('token') || link;
    } catch {
      return link;
    }
  };

  const formatCpf = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
  };

  // ─── Step 1 handlers ───────────────────────────────────────────────────────

  const handleSendEmail = async () => {
    try {
      setEmailSending(true);
      const res = await post(endpoints.kycSendEmailUrl, {});
      setEmailSent(true);
      if (res.data?.devVerificationLink) {
        const token = extractTokenFromLink(res.data.devVerificationLink);
        setDevEmailLink(token);
        setEmailToken(token);
      }
    } catch (error) {
      addMessageToToast(
        error?.response?.data?.message || t('errors.generic'),
        { status: 'error', icon: 'alert-triangle' }
      );
    } finally {
      setEmailSending(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!emailToken.trim()) return;
    try {
      setEmailConfirming(true);
      await post(endpoints.kycVerifyEmailUrl, { verificationToken: emailToken.trim() });
      addMessageToToast(t('success.email'), { status: 'success', icon: 'check-circle' });
      setEmailSent(false);
      setEmailToken('');
      setDevEmailLink(null);
      await loadStatus();
    } catch (error) {
      addMessageToToast(
        error?.response?.data?.message || t('errors.generic'),
        { status: 'error', icon: 'alert-triangle' }
      );
    } finally {
      setEmailConfirming(false);
    }
  };

  // ─── Step 2 handlers ───────────────────────────────────────────────────────

  const handleSendSms = async () => {
    try {
      setSmsSending(true);
      const res = await post(endpoints.kycSendPhoneUrl, {});
      setSmsSent(true);
      if (res.data?.devCode) {
        setDevSmsCode(String(res.data.devCode));
        setSmsCode(String(res.data.devCode));
      }
    } catch (error) {
      addMessageToToast(
        error?.response?.data?.message || t('errors.generic'),
        { status: 'error', icon: 'alert-triangle' }
      );
    } finally {
      setSmsSending(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (!smsCode.trim()) return;
    try {
      setSmsConfirming(true);
      await post(endpoints.kycVerifyPhoneUrl, { code: smsCode.trim() });
      addMessageToToast(t('success.phone'), { status: 'success', icon: 'check-circle' });
      setSmsSent(false);
      setSmsCode('');
      setDevSmsCode(null);
      await loadStatus();
    } catch (error) {
      addMessageToToast(
        error?.response?.data?.message || t('errors.generic'),
        { status: 'error', icon: 'alert-triangle' }
      );
    } finally {
      setSmsConfirming(false);
    }
  };

  // ─── Step 3 handler ────────────────────────────────────────────────────────

  const handleSubmitCpf = async () => {
    if (!cpfValue || !fullName || !birthDate) return;
    try {
      setCpfSubmitting(true);
      const rawCpf = cpfValue.replace(/\D/g, '');
      await post(endpoints.kycSubmitCpfUrl, {
        cpf: rawCpf,
        fullName: fullName.trim(),
        birthDate,
      });
      addMessageToToast(t('success.cpf'), { status: 'success', icon: 'check-circle' });
      await loadStatus();

      // check if all done — fire completion toast
      const latest = await get(endpoints.kycStatusUrl);
      if (latest.data?.kycLevel === 1) {
        addMessageToToast(t('success.complete'), { status: 'success', icon: 'check-circle' });
      }
    } catch (error) {
      addMessageToToast(
        error?.response?.data?.message || t('errors.generic'),
        { status: 'error', icon: 'alert-triangle' }
      );
    } finally {
      setCpfSubmitting(false);
    }
  };

  // ─── Derived state ─────────────────────────────────────────────────────────

  const emailDone = kycStatus?.checklist?.email ?? false;
  const phoneDone = kycStatus?.checklist?.phone ?? false;
  const cpfDone = kycStatus?.checklist?.cpf ?? false;

  const completedCount = [emailDone, phoneDone, cpfDone].filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 3) * 100);
  const isFullyVerified = kycStatus?.kycLevel === 1;

  // ─── Render ────────────────────────────────────────────────────────────────

  if (loadingStatus) {
    return (
      <PageWrapper>
        <PageTitle>{t('title')}</PageTitle>
        <PageSubtitle style={{ marginTop: 16 }}>Carregando...</PageSubtitle>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageTitle>{t('title')}</PageTitle>
      <PageSubtitle>{t('subtitle')}</PageSubtitle>

      {isFullyVerified ? (
        <SuccessBanner>&#x2705; {t('level1Banner')}</SuccessBanner>
      ) : (
        <InfoBanner>&#x26A0; {t('level0Banner')}</InfoBanner>
      )}

      {/* Progress bar */}
      <ProgressBar>
        <ProgressLabel>
          {t('progress', { current: completedCount, total: 3 })} &mdash; {progressPercent}%
        </ProgressLabel>
        <ProgressTrack>
          <ProgressFill $percent={progressPercent} />
        </ProgressTrack>
      </ProgressBar>

      <StepsGrid>
        {/* ── Step 1: Email ─────────────────────────────────────────────── */}
        <StepCard $done={emailDone}>
          <StepHeader>
            <StepTitle>{t('step1.title')}</StepTitle>
            {emailDone && <DoneChip>&#x2713; {t('step1.verified')}</DoneChip>}
          </StepHeader>

          {emailDone ? (
            <StepLabel>{t('step1.verified')}</StepLabel>
          ) : (
            <>
              <StepLabel>{t('step1.label')}</StepLabel>
              {user?.emailAddress && (
                <UserInfo>{user.emailAddress}</UserInfo>
              )}

              {devEmailLink && (
                <DevBox>
                  {t('step1.devMode')}<strong>{devEmailLink}</strong>
                </DevBox>
              )}

              {!emailSent ? (
                <ActionButton
                  onClick={handleSendEmail}
                  $loading={emailSending}
                  disabled={emailSending}
                >
                  {emailSending ? 'Enviando...' : t('step1.send')}
                </ActionButton>
              ) : (
                <InputRow>
                  <InputLabel>{t('step1.tokenLabel')}</InputLabel>
                  <InputField
                    type="text"
                    placeholder="eyJhbGciOi..."
                    value={emailToken}
                    onChange={(e) => setEmailToken(e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <ActionButton
                      onClick={handleVerifyEmail}
                      $loading={emailConfirming}
                      disabled={emailConfirming || !emailToken.trim()}
                    >
                      {emailConfirming ? 'Confirmando...' : t('step1.confirm')}
                    </ActionButton>
                    <ActionButton
                      onClick={() => { setEmailSent(false); setDevEmailLink(null); setEmailToken(''); }}
                      style={{ background: ThemeColor['gray-80'], color: '#fff' }}
                    >
                      Reenviar
                    </ActionButton>
                  </div>
                </InputRow>
              )}
            </>
          )}
        </StepCard>

        {/* ── Step 2: Phone ─────────────────────────────────────────────── */}
        <StepCard $done={phoneDone} $disabled={!emailDone}>
          <StepHeader>
            <StepTitle>{t('step2.title')}</StepTitle>
            {phoneDone && <DoneChip>&#x2713; {t('step2.verified')}</DoneChip>}
          </StepHeader>

          {!emailDone ? (
            <BlockedNote>{t('step2.blocked')}</BlockedNote>
          ) : phoneDone ? (
            <StepLabel>{t('step2.verified')}</StepLabel>
          ) : (
            <>
              <StepLabel>{t('step2.label')}</StepLabel>
              {user?.phoneNumber && (
                <UserInfo>{user.phoneNumber}</UserInfo>
              )}

              {devSmsCode && (
                <DevBox>
                  {t('step2.devMode')}<strong>{devSmsCode}</strong>
                </DevBox>
              )}

              {!smsSent ? (
                <ActionButton
                  onClick={handleSendSms}
                  $loading={smsSending}
                  disabled={smsSending}
                >
                  {smsSending ? 'Enviando...' : t('step2.send')}
                </ActionButton>
              ) : (
                <InputRow>
                  <InputLabel>{t('step2.codeLabel')}</InputLabel>
                  <InputField
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="123456"
                    value={smsCode}
                    onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  />
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <ActionButton
                      onClick={handleVerifyPhone}
                      $loading={smsConfirming}
                      disabled={smsConfirming || smsCode.length !== 6}
                    >
                      {smsConfirming ? 'Confirmando...' : t('step2.confirm')}
                    </ActionButton>
                    <ActionButton
                      onClick={() => { setSmsSent(false); setDevSmsCode(null); setSmsCode(''); }}
                      style={{ background: ThemeColor['gray-80'], color: '#fff' }}
                    >
                      Reenviar
                    </ActionButton>
                  </div>
                </InputRow>
              )}
            </>
          )}
        </StepCard>

        {/* ── Step 3: CPF ───────────────────────────────────────────────── */}
        <StepCard $done={cpfDone} $disabled={!phoneDone}>
          <StepHeader>
            <StepTitle>{t('step3.title')}</StepTitle>
            {cpfDone && <DoneChip>&#x2713; {t('step3.verified')}</DoneChip>}
          </StepHeader>

          {!phoneDone ? (
            <BlockedNote>{t('step3.blocked')}</BlockedNote>
          ) : cpfDone ? (
            <StepLabel>{t('step3.verified')}</StepLabel>
          ) : (
            <>
              <StepLabel>{t('step3.label')}</StepLabel>

              <InputLabel>{t('step3.cpfLabel')}</InputLabel>
              <InputField
                type="text"
                placeholder="000.000.000-00"
                value={cpfValue}
                onChange={(e) => setCpfValue(formatCpf(e.target.value))}
                maxLength={14}
              />

              <InputLabel>{t('step3.fullNameLabel')}</InputLabel>
              <InputField
                type="text"
                placeholder="Nome Completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <InputLabel>{t('step3.birthDateLabel')}</InputLabel>
              <InputField
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                style={{ colorScheme: 'dark' }}
              />

              <div style={{ marginTop: '4px' }}>
                <ActionButton
                  onClick={handleSubmitCpf}
                  $loading={cpfSubmitting}
                  disabled={cpfSubmitting || !cpfValue || !fullName || !birthDate}
                >
                  {cpfSubmitting ? 'Enviando...' : t('step3.submit')}
                </ActionButton>
              </div>
            </>
          )}
        </StepCard>
      </StepsGrid>
    </PageWrapper>
  );
};
