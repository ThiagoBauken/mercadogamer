import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';

import { closeAuthModal, useAppDispatch } from '@store';
import { EmailValidationRegex, endpoints, post } from '@utils';
import React, { useState } from 'react';

const Modal = dynamic(() => import('@widgets/modal').then(mod => mod.Modal), { ssr: false });

const FormInput = dynamic(() => import('@widgets/form').then(mod => mod.FormInput), { ssr: false });

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

type Props = ModalProps;

export const ResetPassword: React.FC<Props> = ({ open }) => {
  const { t } = useTranslation('common');
  const [state, setState] = useState<{ success: boolean; loading: boolean }>({
    success: false,
    loading: false,
  });

  const dispatch = useAppDispatch();

  const { control, handleSubmit, watch } = useForm<{ username: string }>();

  const onClose = (): void => {
    dispatch(closeAuthModal());
  };

  const onSubmit = async ({ username }: { username: string }): Promise<void> => {
    try {
      setState({ ...state, loading: true });
      await post(endpoints.resetPassword(username), {});
      setState({ ...state, loading: false, success: true });
    } catch (error) {
      setState({ ...state, loading: false, success: false });
      console.error('Failed to reset password:', error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      contentClass={!state.success ? 'reset-password-modal-content' : 'reset-password-success-mail'}
    >
      {!state.success ? (
        <React.Fragment>
          <div className="header">
            <div className="title">{t('reset_password.title')}</div>
            <div className="description">
              {t('reset_password.description')}
            </div>
          </div>
          <form className="content" onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              full
              label={t('reset_password.email_label')}
              control={control}
              name="username"
              rules={{
                required: t('reset_password.required_field'),
                pattern: {
                  value: EmailValidationRegex,
                  message: t('reset_password.invalid_email'),
                },
              }}
            />

            <Button type="submit" full disabled={!watch('username')} loading={state.loading}>
              {t('reset_password.submit_button')}
            </Button>
          </form>

          <div className="return" onClick={onClose}>
            {t('back')}
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="image-container"></div>
          <div className="title">{t('reset_password.email_sent_title')}</div>
          <div className="description">
            {t('reset_password.email_sent_description')}
          </div>
          <Button full onClick={onClose}>
            {t('reset_password.done_button')}
          </Button>
        </React.Fragment>
      )}
    </Modal>
  );
};
