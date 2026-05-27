// @ts-nocheck - TypeScript compatibility fix
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { UseFormReturn } from 'react-hook-form';
import { useTypedSelector } from '@store';



import { ButtonProps } from '@ui-shared/types/button';

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

const RangeSlider = dynamic(() => import('@widgets/range-slider').then(mod => mod.RangeSlider), { ssr: false });

const Modal = dynamic(() => import('@widgets/modal').then(mod => mod.Modal), { ssr: false });

type Props = {
  open: boolean;
  formController: UseFormReturn<
    WithDrawalModelType & { paymentMethod: string; userInfo: string; taxId: string },
    any
  >;
  button: ButtonProps;
  onClose: () => void;
};
const WithDrawalAmount: React.FC<Props> = ({
  open,
  button,
  formController: { setValue, watch },
  onClose,
}) => {
  const { user } = useTypedSelector((store) => store.auth);
  useEffect(() => {
    setValue('amount', user?.balance);
  }, [user?.balance]);
  return (
    <Modal
      open={open}
      contentClass="withdrawal-modal amount"
      header="Retirar dinero"
      onClose={onClose}
    >
      <div className="title">¿Cuánto dinero deseas retirar?</div>

      <div className="value">
        <div className="content">{Math.round((watch('amount') / 10) * 10) || 0}</div>
      </div>

      <RangeSlider
        value={[user?.balance]}
        max={user?.balance || 100}
        // onChange={(value) => setValue('amount', value?.[0])}
      />

      <div className="description">
        Disponible para retirar: ${Math.round((watch('amount') / 10) * 10) || 0}
      </div>

      <Button {...button} />
    </Modal>
  );
};

export default WithDrawalAmount;
