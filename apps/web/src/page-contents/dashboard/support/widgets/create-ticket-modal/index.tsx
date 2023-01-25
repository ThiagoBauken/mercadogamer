import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { addMessageToToast, endpoints, post } from '@utils';
import { Modal } from '@widgets/modal';
import { FormSelect, FormTextarea } from '@widgets/form';
import { WrapLabel } from '@widgets/wrap-label';
import { FileSelector } from '@widgets/file-selector';
import { Button } from '@widgets/button';

const CreateTicketModal: React.FC<ModalProps & { onAction: () => void }> = (props) => {
  const { control, handleSubmit } = useForm<TicketModelType>({});

  const topics = useMemo<string[]>(
    () => ['Compras', 'Pagos', 'Activación de código', 'Productos', 'Otro asunto'],
    []
  );

  const onSubmit = async (ticket: TicketModelType): Promise<void> => {
    try {
      await post(endpoints.ticketUrl, ticket);
      addMessageToToast('Tu ticket fue enviado, pronto te contactaremos.', {
        status: 'success',
        icon: 'check-circle',
      });
      props.onAction();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal {...props} contentClass="create-ticket-modal" header="Generar ticket">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormSelect
          control={control}
          name="title"
          label="Selecciona un tema"
          items={topics.map((item) => ({ label: item, value: item }))}
          full
          rules={{ required: 'Este campo es obligatorio.' }}
        />

        <FormTextarea
          control={control}
          name="body"
          label="Escribí tu consulta"
          full
          rules={{ required: 'Este campo es obligatorio.' }}
        />

        <WrapLabel label="Adjunta un archivo">
          <FileSelector />
        </WrapLabel>

        <Button full type="submit">
          Enviar ticket
        </Button>
      </form>
    </Modal>
  );
};

export default CreateTicketModal;
