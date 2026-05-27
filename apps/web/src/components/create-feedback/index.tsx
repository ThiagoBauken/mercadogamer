import { useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { addMessageToToast, endpoints, post } from '@utils';







const Modal = dynamic(() => import('@widgets/modal').then(mod => mod.Modal), { ssr: false });

const FormSelect = dynamic(() => import('@widgets/form').then(mod => mod.FormSelect), { ssr: false });
const FormTextarea = dynamic(() => import('@widgets/form').then(mod => mod.FormTextarea), { ssr: false });

const WrapLabel = dynamic(() => import('@widgets/wrap-label').then(mod => mod.WrapLabel), { ssr: false });

const FileSelector = dynamic(() => import('@widgets/file-selector').then(mod => mod.FileSelector), { ssr: false });

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

const CreateFeedbackModal: React.FC<ModalProps> = (props) => {
  const { t } = useTranslation('common');
  const { control, handleSubmit } = useForm<FeedbackModelType>({});

  const topics = useMemo<string[]>(() => [t('feedback.report_error'), t('feedback.send_comment')], [t]);

  const onSubmit = async (feedback: FeedbackModelType): Promise<void> => {
    try {
      await post(endpoints.feedbackUrl, feedback);
      addMessageToToast(t('feedback.success_message'), {
        status: 'success',
        icon: 'check-circle',
      });
      props.onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <Modal {...props} contentClass="create-feedback-modal" header={t('mobile_nav.send_feedback')}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormSelect
          control={control}
          name="title"
          label={t('feedback.select_topic')}
          items={topics.map((item) => ({ label: item, value: item }))}
          full
          rules={{ required: t('feedback.required_field') }}
        />

        <FormTextarea
          control={control}
          name="body"
          label={t('feedback.write_message')}
          full
          rules={{ required: t('feedback.required_field') }}
        />

        <WrapLabel label={t('feedback.attach_file')}>
          <FileSelector />
        </WrapLabel>

        <Button full type="submit">
          {t('mobile_nav.send_feedback')}
        </Button>
      </form>
    </Modal>
  );
};

export default CreateFeedbackModal;
