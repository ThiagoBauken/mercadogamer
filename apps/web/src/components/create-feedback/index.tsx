import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { addMessageToToast, endpoints, post } from '@utils';
import { Modal } from '@widgets/modal';
import { FormSelect, FormTextarea } from '@widgets/form';
import { WrapLabel } from '@widgets/wrap-label';
import { FileSelector } from '@widgets/file-selector';
import { Button } from '@widgets/button';

const CreateFeedbackModal: React.FC<ModalProps> = (props) => {
  const { control, handleSubmit } = useForm<FeedbackModelType>({});

  const topics = useMemo<string[]>(() => ['Reportar error', 'Enviar comentario'], []);

  const onSubmit = async (feedback: FeedbackModelType): Promise<void> => {
    try {
      await post(endpoints.feedbackUrl, feedback);
      addMessageToToast('Tu nuevo comentario fue enviado.', {
        status: 'success',
        icon: 'check-circle',
      });
      props.onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal {...props} contentClass="create-feedback-modal" header="Enviar feedback">
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
          label="Escribí tu mensaje"
          full
          rules={{ required: 'Este campo es obligatorio.' }}
        />

        <WrapLabel label="Adjunta un archivo">
          <FileSelector />
        </WrapLabel>

        <Button full type="submit">
          Enviar feedback
        </Button>
      </form>
    </Modal>
  );
};

export default CreateFeedbackModal;
function setState(arg0: { ticketmodal: boolean }) {
  throw new Error('Function not implemented.');
}
