import { addMessageToToast, endpoints, put } from '@utils';
import { Button } from '@widgets/button';
import { Modal } from '@widgets/modal';

type Props = { open: boolean; orderId: string; onClose: () => void; onAction: () => void };

export const CancelOrderModal: React.FC<Props> = ({ orderId, open, onAction, onClose }) => {
  const onCancel = async (): Promise<void> => {
    try {
      await put<OrderModelType, any>(`${endpoints.orderUrl}/${orderId}`, {
        status: 'cancelled',
      });
      addMessageToToast('Se canceló la venta.', { status: 'error', icon: 'alert-triangle' });
      onAction && onAction();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal open={open} contentClass="cancel-order-modal" header="Cancelar venta" onClose={onClose}>
      <div className="message">Si cancelas la venta el dinero será reembolsado al comprador.</div>
      <Button full onClick={onCancel}>
        Cancelar venta
      </Button>
    </Modal>
  );
};
