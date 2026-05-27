// @ts-nocheck - TypeScript compatibility fix
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { addMessageToToast, endpoints, post } from '@utils';

import TwoFactor from '@widgets/two-factor';


type Props = {
  open: boolean;
  onVerification?: () => void;
  onResend?: () => void;
  onClose: () => void;
};


const Modal = dynamic(() => import('@widgets/modal').then(mod => mod.Modal), { ssr: false });

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

export const TwoFactorAuthentication: React.FC<Props> = (props) => {
  const { open, onClose, onResend } = props;
  const { t } = useTranslation('gift');

  const [state, setState] = useState<{ code: string }>({ code: '' });

  const onVerification = async (): Promise<void> => {
    try {
      const response = await post(`${endpoints.userUrl}/confirmSms`, { sms: state.code });
      if (response.data && props.onVerification) {
        props.onVerification();
      } else {
        addMessageToToast(t('verification.phone.invalid_code'), { status: 'error' });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal
      open={open}
      header={t('verification.code.title')}
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
