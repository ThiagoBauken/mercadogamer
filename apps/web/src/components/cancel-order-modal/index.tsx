import { addMessageToToast, endpoints, put } from '@utils';
import dynamic from 'next/dynamic';


import { useTranslation } from 'next-i18next';


const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

const Modal = dynamic(() => import('@widgets/modal').then(mod => mod.Modal), { ssr: false });

type Props = { open: boolean; orderId: string; onClose: () => void; onAction: () => void };

export const CancelOrderModal: React.FC<Props> = ({ orderId, open, onAction, onClose }) => {
  const { t } = useTranslation('common');

  const onCancel = async (): Promise<void> => {
    try {
      await put<OrderModelType, any>(`${endpoints.orderUrl}/${orderId}`, {
        status: 'cancelled',
      });
      addMessageToToast(t('modals.cancel_order.success_message'), { status: 'error', icon: 'alert-triangle' });
      onAction && onAction();
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  return (
    <Modal open={open} contentClass="cancel-order-modal" header={t('modals.cancel_order.title')} onClose={onClose}>
      <div className="message">{t('modals.cancel_order.message')}</div>
      <Button full onClick={onCancel}>
        {t('modals.cancel_order.button')}
      </Button>
    </Modal>
  );
};
