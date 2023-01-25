import { useState } from 'react';
import { addMessageToToast, endpoints, post } from '@utils';
import { Modal } from '@widgets/modal';
import TwoFactor from '@widgets/two-factor';
import { Button } from '@widgets/button';

type Props = {
  open: boolean;
  onVerification?: () => void;
  onResend?: () => void;
  onClose: () => void;
};

export const TwoFactorAuthentication: React.FC<Props> = (props) => {
  const { open, onClose, onResend } = props;

  const [state, setState] = useState<{ code: string }>({ code: '' });

  const onVerification = async (): Promise<void> => {
    try {
      const response = await post(`${endpoints.userUrl}/confirmSms`, { sms: state.code });
      if (response.data && props.onVerification) {
        props.onVerification();
      } else {
        addMessageToToast('Código invalido', { status: 'error' });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal
      open={open}
      header="Verifica tu teléfono"
      contentClass="verification-phone"
      width={450}
      onClose={onClose}
    >
      <div className="message">
        Ingrese el código de verificación que se acaba de enviar a tu teléfono.
      </div>

      <TwoFactor
        value={state.code}
        onChange={(code: string[]) => setState({ ...state, code: code.join('') })}
      />

      <Button full onClick={onVerification}>
        Completar verificación
      </Button>

      <div className="resend-code" onClick={onResend}>
        Volver a enviar código
      </div>
    </Modal>
  );
};
