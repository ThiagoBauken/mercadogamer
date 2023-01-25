import { ButtonProps } from '@ui-shared/types/button';
import { Button } from '@widgets/button';
import { FormInput } from '@widgets/form';
import { Modal } from '@widgets/modal';
import { UseFormReturn } from 'react-hook-form';

type Props = {
  open: boolean;
  formController: UseFormReturn<
    WithDrawalModelType & { paymentMethod: string; userInfo: string; taxId: string },
    any
  >;
  button: ButtonProps;
  onClose: () => void;
};

const InputCBUCVU: React.FC<Props> = ({ open, button, formController: { control }, onClose }) => {
  return (
    <Modal
      open={open}
      contentClass="withdrawal-modal payment"
      header="Retirar dinero"
      onClose={onClose}
    >
      <FormInput control={control} name="userInfo" label="CBU/CVU" full />
      <FormInput control={control} name="taxId" label="CUIT/CUIL" full />

      <Button {...button} />
    </Modal>
  );
};

export default InputCBUCVU;
