import { useForm } from 'react-hook-form';
import { addMessageToToast, endpoints, post } from '@utils';
import { Modal } from '@widgets/modal';
import { FormTextarea } from '@widgets/form';

import { Button } from '@widgets/button';

const WithDrawlsRejectModal: React.FC<ModalProps & { onAction: () => void }> = (props) => {
  const { control, handleSubmit } = useForm<WithDrawalModelType>({});

  const onSubmit = async (reject: WithDrawalModelType): Promise<void> => {
    try {
      // submit reject requesting to backend
      addMessageToToast('TLa carga fue rechazada.', {
        status: 'error',
        icon: 'check-circle',
      });
      props.onAction();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal {...props} contentClass="withdrawls-reject-modal" header="Rechazar carga">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormTextarea
          control={control}
          name="body"
          label="Motivo"
          placeholder=" Placeholder"
          full
          rules={{ required: 'Este campo es obligatorio.' }}
        />

        <Button full type="submit">
          Rechazar carga
        </Button>
      </form>
    </Modal>
  );
};

export default WithDrawlsRejectModal;
