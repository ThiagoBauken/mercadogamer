import { useForm } from 'react-hook-form';
import { useTypedSelector, useAppDispatch } from '@store';
import { useSocket } from '@web/hooks/use-socket';
import { Modal } from '@widgets/modal';
import { FormSelect, FormTextarea } from '@widgets/form';
import { FileSelector } from '@widgets/file-selector';
import { Button } from '@widgets/button';
import { addMessageToToast } from '@utils';

type FormData = {
  motive: string;
  description: string;
  order: string;
  user: string;
};

type Props = {
  open: boolean;
  orderId: string;
  onClose: () => void;
  onAction?: () => void;
};
const ReportModal: React.FC<Props> = ({ open, orderId, onClose, onAction }) => {
  const { user } = useTypedSelector((store) => store.auth);
  const { socket } = useSocket();
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {},
  });

  const dispatch = useAppDispatch();

  const onAttachFileChange = (file: File) => {
    console.log(file);
  };

  const onSubmit = (data: FormData): void => {
    console.log('report data=>', data);
    const item = {
      ...data,
      order: orderId,
      user: user.id,
    };
    socket.emit('claim-order', item);
    addMessageToToast('Tu reporte fue enviado, pronto te contactaremos.', {
      status: 'success',
      icon: 'check-circle',
    });
    onClose();

    if (onAction) onAction();
  };

  return (
    <Modal open={open} width={450} header="Tuve un problema" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="report-modal">
        <FormSelect
          label="¿Cual fue el problema?"
          control={control}
          name="motive"
          placeholder="Motivo del Reclamo"
          rules={{ required: 'Este campo es obligatorio' }}
          full
          items={[
            {
              label: 'No funciona/está vencido',
              value: 'notWorking',
            },
            {
              label: 'No lo entregó',
              value: 'undelivered',
            },
            {
              label: 'Me equivoqué con la compra',
              value: 'mistake',
            },
          ]}
        />
        <FormTextarea
          label="Describe el problema"
          full
          control={control}
          name="description"
          rules={{ required: 'Este campo es obligatorio' }}
        />

        <FileSelector label="Adjunta un archivo" onChange={onAttachFileChange} />

        <Button full type="submit">
          Enviar reporte
        </Button>
      </form>
    </Modal>
  );
};

export default ReportModal;
