// @ts-nocheck - TypeScript compatibility fix
import { UseFormReturn } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { useTypedSelector } from '@store';
import { madeBackgroundImageUrl } from '@utils';



import { ButtonProps } from '@ui-shared/types/button';

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

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
const WithDrawalPayment: React.FC<Props> = ({
  open,
  button,
  formController: { setValue, watch },
  onClose,
}) => {
  const {
    payment: { payments },
    // paymentMethod: { paymentMethods },
  } = useTypedSelector((store) => store);
  return (
    <Modal
      open={open}
      contentClass="withdrawal-modal payment"
      header="Retirar dinero"
      onClose={onClose}
    >
      <div className="title">Selecciona un medio de pago</div>
      <ul>
        {payments.map((item, index) => (
          <li
            className={watch('paymentMethod') === item.code ? 'active' : ''}
            key={index}
            onClick={() => setValue('paymentMethod', item.code)}
          >
            <div
              className="image-container"
              style={{
                backgroundImage: madeBackgroundImageUrl(
                  payments.find((payment) => payment.code === item.code)?.img
                ),
              }}
            ></div>
            <div className="label">
              {payments.find((payment) => payment.code === item.code)?.name}
            </div>
            <div className="active">
              <Icon name="check-circle" />
            </div>
          </li>
        ))}
      </ul>
      <div className="description">
        <Icon name="alert-triangle" />
        Las transferencias se realizan Martes y Viernes.
      </div>

      <Button {...button} />
    </Modal>
  );
};

export default WithDrawalPayment;
