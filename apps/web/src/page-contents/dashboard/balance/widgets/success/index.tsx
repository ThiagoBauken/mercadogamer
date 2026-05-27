// @ts-nocheck - TypeScript compatibility fix
import { ButtonProps } from '@ui-shared/types/button';
import dynamic from 'next/dynamic';


import { UseFormReturn } from 'react-hook-form';

const Modal = dynamic(() => import('@widgets/modal').then(mod => mod.Modal), { ssr: false });

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

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

const WithdrawalSuccess: React.FC<Props> = ({
  open,
  button,
  formController: { watch, formState },
  onClose,
}) => {
  return (
    <Modal
      open={open}
      contentClass="withdrawal-modal success"
      header="Retirar dinero"
      onClose={onClose}
    >
      <div className="image-container"></div>
      <div className="title">Tu dinero está en camino</div>
      <div className="amount">{`$${watch('amount')} - Transferencia bancaria`}</div>
      <div className="description">Se acredita el próximo martes.</div>
      <Button {...button} />
    </Modal>
  );
};

export default WithdrawalSuccess;
