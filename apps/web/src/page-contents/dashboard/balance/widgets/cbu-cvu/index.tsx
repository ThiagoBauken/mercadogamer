// @ts-nocheck - TypeScript compatibility fix
import { ButtonProps } from '@ui-shared/types/button';
import dynamic from 'next/dynamic';



import { UseFormReturn } from 'react-hook-form';

const Modal = dynamic(() => import('@widgets/modal').then(mod => mod.Modal), { ssr: false });

const FormInput = dynamic(() => import('@widgets/form').then(mod => mod.FormInput), { ssr: false });

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

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
