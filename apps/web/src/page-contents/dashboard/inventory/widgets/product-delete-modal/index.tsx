import { ThemeColor } from '@theme/color';
import { Button } from '@widgets/button';
import { Icon } from '@widgets/icon';
import { Modal } from '@widgets/modal';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const ProductDeleteModal: React.FC<Props> = ({ open, onClose, onConfirm }) => {
  return (
    <Modal open={open} onClose={onClose} contentClass="delete-product-modal">
      <div className="icon">
        <Icon name="trash"></Icon>
      </div>
      <div className="message">¿Quieres vaciar el carrito?</div>
      <div className="action">
        <Button size="big" bgColor={ThemeColor.negative} onClick={onConfirm}>
          Eliminar
        </Button>
        <Button size="big" bgColor={ThemeColor.negative} kind="secondary" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </Modal>
  );
};

export default ProductDeleteModal;
