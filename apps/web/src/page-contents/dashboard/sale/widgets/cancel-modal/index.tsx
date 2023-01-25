import { Button } from '@widgets/button';
import { Modal } from '@widgets/modal';

const CancelModal: React.FC<ModalProps & { onAction: () => void }> = ({
  onAction,
  ...modalProps
}) => {
  return (
    <Modal {...modalProps} header="Cancelar venta" contentClass="cancel-sale-modal">
      <p>Si cancelas la venta el dinero será reembolsado al comprador.</p>
      <Button onClick={() => onAction()} full>
        Cancelar venta
      </Button>
    </Modal>
  );
};

export default CancelModal;
