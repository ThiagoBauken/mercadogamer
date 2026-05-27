// @ts-nocheck - TypeScript compatibility fix
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });




const InputPhone = dynamic(() => import('@widgets/input-phone').then(mod => mod.InputPhone), { ssr: false });

const Modal = dynamic(() => import('@widgets/modal').then(mod => mod.Modal), { ssr: false });

type Props = {
  open: boolean;
  onClose: () => void;
  onVerification?: (phone: string) => void;
};

const VerificationPhone: React.FC<Props> = (props) => {
  const { open } = props;
  const { t } = useTranslation('gift');

  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const onEnterCode = (): void => {
    props.onVerification && props.onVerification(phoneNumber);
  };
  return (
    <Modal
      open={open}
      header={t('verification.phone.title')}
      contentClass="verification-phone"
      width={450}
      onClose={props.onClose}
    >
      <div className="message">
        Te enviaremos un mensaje de texto para verificar tu número. No compartiremos tu número de
        teléfono con nadie más.
      </div>

      <InputPhone label={t('verification.phone.label')} phone={phoneNumber} onChange={setPhoneNumber} />

      <Button full onClick={onEnterCode}>
        Enviar código
      </Button>
    </Modal>
  );
};

export default VerificationPhone;
