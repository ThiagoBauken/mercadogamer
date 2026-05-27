import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { useTypedSelector, useAppDispatch } from '@store';
import { useSocket } from '@web/hooks/use-socket';




import { addMessageToToast } from '@utils';
import { useTranslation } from 'next-i18next';


const Modal = dynamic(() => import('@widgets/modal').then(mod => mod.Modal), { ssr: false });

const FormSelect = dynamic(() => import('@widgets/form').then(mod => mod.FormSelect), { ssr: false });
const FormTextarea = dynamic(() => import('@widgets/form').then(mod => mod.FormTextarea), { ssr: false });

const FileSelector = dynamic(() => import('@widgets/file-selector').then(mod => mod.FileSelector), { ssr: false });

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

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
  const { t } = useTranslation('common');
  const { user } = useTypedSelector((store) => store.auth);
  const { socket } = useSocket();
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {},
  });

  const dispatch = useAppDispatch();

  const onAttachFileChange = (file: File) => {
    // File attachment handler - can be extended for upload functionality
  };

  const onSubmit = (data: FormData): void => {
    const item = {
      ...data,
      order: orderId,
      user: user.id,
    };
    socket.emit('claim-order', item);
    addMessageToToast(t('modals.report.success_message'), {
      status: 'success',
      icon: 'check-circle',
    });
    onClose();

    if (onAction) onAction();
  };

  return (
    <Modal open={open} width={450} header={t('modals.report.title')} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="report-modal">
        <FormSelect
          label={t('modals.report.problem_label')}
          control={control}
          name="motive"
          placeholder={t('modals.report.problem_placeholder')}
          rules={{ required: t('modals.report.required_field') }}
          full
          items={[
            {
              label: t('modals.report.problems.not_working'),
              value: 'notWorking',
            },
            {
              label: t('modals.report.problems.undelivered'),
              value: 'undelivered',
            },
            {
              label: t('modals.report.problems.mistake'),
              value: 'mistake',
            },
          ]}
        />
        <FormTextarea
          label={t('modals.report.description_label')}
          full
          control={control}
          name="description"
          rules={{ required: t('modals.report.required_field') }}
        />

        <FileSelector label={t('modals.report.attach_file_label')} onChange={onAttachFileChange} />

        <Button full type="submit">
          {t('modals.report.submit_button')}
        </Button>
      </form>
    </Modal>
  );
};

export default ReportModal;
