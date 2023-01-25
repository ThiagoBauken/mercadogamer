import { Button } from '@widgets/button';
import { Checkbox } from '@widgets/checkbox';
import { Modal } from '@widgets/modal';
import { useState } from 'react';

type Props = {
  open: boolean;
  onAction: () => void;
  onClose: () => void;
};
const ConfirmModal: React.FC<Props> = ({ open, onAction, onClose }) => {
  const [state, setState] = useState<{ checked: boolean }>({ checked: false });
  return (
    <Modal
      open={open}
      width={450}
      header="Finalizar transacción"
      contentClass="finalize-transaction-modal"
      onClose={onClose}
    >
      <div className="description">
        Una vez que hayas verificado la validez del producto, por favor finaliza la transacción. El
        vendedor recibirá el dinero por la venta.
      </div>

      <Checkbox
        checked={state.checked}
        onChange={(value) => setState({ ...state, checked: value })}
      >
        He verificado la validez del producto y estoy de acuerdo con que el vendedor reciba el
        dinero.
      </Checkbox>

      <Button full onClick={onAction} disabled={!state.checked}>
        Finalizar transacción
      </Button>
    </Modal>
  );
};

export default ConfirmModal;
