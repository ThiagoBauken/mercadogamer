import { ButtonProps } from '@ui-shared/types/button';
import { Button } from '@widgets/button';
import { Icon } from '@widgets/icon';
import { Modal } from '@widgets/modal';
import { UseFormReturn } from 'react-hook-form';

type Props = {
  open: boolean;
  formController: UseFormReturn<
    WithDrawalModelType & {
      paymentMethod: string;
      userInfo: string;
      taxId: string;
    },
    any
  >;
  button: ButtonProps;
  onClose: () => void;
};

const WithdrawalConfirm: React.FC<Props> = ({
  open,
  button,
  formController: { watch },
  onClose,
}) => {
  return (
    <Modal
      open={open}
      contentClass="withdrawal-modal confirm"
      header="Retirar dinero"
      onClose={onClose}
    >
      <div className="title">Confirma la información</div>
      <div className="value">${watch('amount')?.toFixed(2)}</div>

      <div className="user-info">Transferencia bancaria - {watch('userInfo')}</div>
      <div className="user-info">CUIT/CUIL - {watch('taxId')}</div>

      <div className="helper">
        <Icon name="alert-triangle" />
        <div className="label">Se acredita el próximo martes.</div>
      </div>
      <Button {...button} />
    </Modal>
  );
};

export default WithdrawalConfirm;
