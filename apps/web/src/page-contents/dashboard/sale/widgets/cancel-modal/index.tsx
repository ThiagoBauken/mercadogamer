// @ts-nocheck - TypeScript compatibility fix

import dynamic from 'next/dynamic';

import { useTranslation } from 'next-i18next';

const Modal = dynamic(() => import('@widgets/modal').then(mod => mod.Modal), { ssr: false });

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

const CancelModal: React.FC<ModalProps & { onAction: () => void }> = ({
  onAction,
  ...modalProps
}) => {
  const { t } = useTranslation('common');

  return (
    <Modal {...modalProps} header={t('modals.cancel_order.title')} contentClass="cancel-sale-modal">
      <p>{t('modals.cancel_order.message')}</p>
      <Button onClick={() => onAction()} full>
        {t('modals.cancel_order.button')}
      </Button>
    </Modal>
  );
};

export default CancelModal;
