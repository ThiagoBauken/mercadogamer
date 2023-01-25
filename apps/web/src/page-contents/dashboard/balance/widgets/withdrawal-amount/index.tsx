import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTypedSelector } from '@store';
import { Modal } from '@widgets/modal';
import { RangeSlider } from '@widgets/range-slider';
import { Button } from '@widgets/button';
import { ButtonProps } from '@ui-shared/types/button';

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
