// @ts-nocheck
import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';
import { addMessageToToast, endpoints, post } from '@utils';
import { ThemeColor } from '@theme/color';

// ─── Types ────────────────────────────────────────────────────────────────────

type DisputeReason = 'not_received' | 'not_working' | 'fake' | 'chargeback' | 'other';

interface Props {
  open: boolean;
  orderId: string;
  onClose: () => void;
  onSuccess: (disputeId: string) => void;
}

// ─── Styled Components ────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const ModalBox = styled.div`
  background: ${ThemeColor['gray-110']};
  border: 1px solid ${ThemeColor['gray-80']};
  border-radius: 16px;
  padding: 28px;
  width: 100%;
  max-width: 480px;
  z-index: 9999;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 20px 0;
`;

const Label = styled.label`
  display: block;
  font-size: 12px;
  color: ${ThemeColor['gray-50']};
  margin-bottom: 6px;
`;

const Select = styled.select`
  width: 100%;
  background: ${ThemeColor['gray-100']};
  border: 1px solid ${ThemeColor['gray-80']};
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  padding: 10px 14px;
  margin-bottom: 16px;
  outline: none;
  box-sizing: border-box;
  cursor: pointer;
  appearance: none;

  &:focus {
    border-color: ${ThemeColor.primary};
  }

  option {
    background: ${ThemeColor['gray-100']};
  }
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
  min-height: 100px;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
  transition: border-color 0.2s;
  margin-bottom: 4px;

  &:focus {
    border-color: ${ThemeColor.primary};
  }

  &::placeholder {
    color: ${ThemeColor['gray-60']};
  }
`;

const CharHint = styled.div<{ $ok: boolean }>`
  font-size: 11px;
  color: ${({ $ok }) => ($ok ? ThemeColor.positive : ThemeColor['gray-60'])};
  margin-bottom: 20px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
`;

const PrimaryButton = styled.button<{ $loading?: boolean }>`
  flex: 1;
  padding: 10px 18px;
  border-radius: 50px;
  border: none;
  background: ${ThemeColor.primary};
  color: ${ThemeColor['gray-130']};
  font-size: 14px;
  font-weight: 700;
  cursor: ${({ $loading }) => ($loading ? 'not-allowed' : 'pointer')};
  opacity: ${({ $loading }) => ($loading ? 0.7 : 1)};
  transition: opacity 0.2s;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.85;
  }
`;

const SecondaryButton = styled.button`
  flex: 1;
  padding: 10px 18px;
  border-radius: 50px;
  border: 1px solid ${ThemeColor['gray-70']};
  background: transparent;
  color: ${ThemeColor['gray-30']};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${ThemeColor['gray-50']};
  }
`;

const REASONS: DisputeReason[] = ['not_received', 'not_working', 'fake', 'chargeback', 'other'];

// ─── Component ────────────────────────────────────────────────────────────────

export const OpenDisputeModal: React.FC<Props> = ({ open, orderId, onClose, onSuccess }) => {
  const { t } = useTranslation('disputes');

  const [reason, setReason] = useState<DisputeReason>('not_received');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const isDescriptionValid = description.trim().length >= 10;

  const handleSubmit = async () => {
    if (!isDescriptionValid) {
      addMessageToToast(t('errors.descriptionMin'), { status: 'error', icon: 'alert-triangle' });
      return;
    }
    try {
      setSubmitting(true);
      const res = await post(endpoints.disputesUrl, {
        orderId,
        reason,
        description: description.trim(),
      });
      const disputeId = res.data?.data?._id || res.data?.data?.id || res.data?._id || res.data?.id;
      addMessageToToast(t('success.opened'), { status: 'success', icon: 'check-circle' });
      onSuccess(disputeId);
    } catch {
      addMessageToToast(t('errors.generic'), { status: 'error', icon: 'alert-triangle' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <ModalTitle>{t('openModal.title')}</ModalTitle>

        <Label>{t('openModal.reasonLabel')}</Label>
        <Select value={reason} onChange={(e) => setReason(e.target.value as DisputeReason)}>
          {REASONS.map((r) => (
            <option key={r} value={r}>
              {t(`reason.${r}`)}
            </option>
          ))}
        </Select>

        <Label>{t('openModal.descriptionLabel')}</Label>
        <Textarea
          placeholder="Descreva o problema com detalhes..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <CharHint $ok={isDescriptionValid}>
          {description.trim().length} / 10 caracteres mínimo
        </CharHint>

        <ButtonRow>
          <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
          <PrimaryButton
            $loading={submitting}
            disabled={submitting || !isDescriptionValid}
            onClick={handleSubmit}
          >
            {submitting ? 'Abrindo...' : t('openModal.submit')}
          </PrimaryButton>
        </ButtonRow>
      </ModalBox>
    </Overlay>
  );
};
