import { useState } from 'react';
import { Modal } from '@widgets/modal';
import { InputPhone } from '@widgets/input-phone';
import { Button } from '@widgets/button';

type Props = {
  open: boolean;
  onClose: () => void;
  onVerification?: (phone: string) => void;
};

const VerificationPhone: React.FC<Props> = (props) => {
  const { open } = props;

  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const onEnterCode = (): void => {
    props.onVerification && props.onVerification(phoneNumber);
  };
  return (
    <Modal
      open={open}
      header="Verifica tu teléfono"
      contentClass="verification-phone"
      width={450}
      onClose={props.onClose}
    >
      <div className="message">
        Te enviaremos un mensaje de texto para verificar tu número. No compartiremos tu número de
        teléfono con nadie más.
      </div>

      <InputPhone label="Número de teléfono" phone={phoneNumber} onChange={setPhoneNumber} />

      <Button full onClick={onEnterCode}>
        Enviar código
      </Button>
    </Modal>
  );
};

export default VerificationPhone;
