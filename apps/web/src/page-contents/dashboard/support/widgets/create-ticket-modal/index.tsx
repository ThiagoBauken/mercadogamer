// @ts-nocheck - TypeScript compatibility fix
import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { addMessageToToast, endpoints, post } from '@utils';





import { useTranslation } from 'next-i18next';

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

const FileSelector = dynamic(() => import('@widgets/file-selector').then(mod => mod.FileSelector), { ssr: false });

const WrapLabel = dynamic(() => import('@widgets/wrap-label').then(mod => mod.WrapLabel), { ssr: false });

const FormSelect = dynamic(() => import('@widgets/form').then(mod => mod.FormSelect), { ssr: false });
const FormTextarea = dynamic(() => import('@widgets/form').then(mod => mod.FormTextarea), { ssr: false });

const Modal = dynamic(() => import('@widgets/modal').then(mod => mod.Modal), { ssr: false });

const CreateTicketModal: React.FC<ModalProps & { onAction: () => void }> = (props) => {
  const { t } = useTranslation('common');
  const { control, handleSubmit } = useForm<TicketModelType>({});

  const topics = useMemo<{ label: string; value: string }[]>(
    () => [
      { label: t('modals.ticket.topics.purchases'), value: t('modals.ticket.topics.purchases') },
      { label: t('modals.ticket.topics.payments'), value: t('modals.ticket.topics.payments') },
      { label: t('modals.ticket.topics.code_activation'), value: t('modals.ticket.topics.code_activation') },
      { label: t('modals.ticket.topics.products'), value: t('modals.ticket.topics.products') },
      { label: t('modals.ticket.topics.other'), value: t('modals.ticket.topics.other') },
    ],
    [t]
  );

  const onSubmit = async (ticket: TicketModelType): Promise<void> => {
    try {
      await post(endpoints.ticketUrl, ticket);
      addMessageToToast(t('modals.ticket.success_message'), {
        status: 'success',
        icon: 'check-circle',
      });
      props.onAction();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal {...props} contentClass="create-ticket-modal" header={t('modals.ticket.create_title')}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormSelect
          control={control}
          name="title"
          label={t('modals.ticket.select_topic')}
          items={topics}
          full
          rules={{ required: t('modals.ticket.required_field') }}
        />

        <FormTextarea
          control={control}
          name="body"
          label={t('modals.ticket.write_query')}
          full
          rules={{ required: t('modals.ticket.required_field') }}
        />

        <WrapLabel label={t('modals.ticket.attach_file')}>
          <FileSelector />
        </WrapLabel>

        <Button full type="submit">
          {t('modals.ticket.send_button')}
        </Button>
      </form>
    </Modal>
  );
};

export default CreateTicketModal;
