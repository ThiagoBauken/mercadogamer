import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { closeAuthModal, openLoginModal, signup, useAppDispatch, useTypedSelector } from '@store';
import { useRouter } from 'next/router';
import { addMessageToToast, EmailValidationRegex } from '@utils';

const Modal = dynamic(() => import('@widgets/modal').then(mod => mod.Modal), { ssr: false });
const FormInput = dynamic(() => import('@widgets/form').then(mod => mod.FormInput), { ssr: false });
const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

interface ModalProps {
  open: boolean;
}

type FormData = {
  username: string;
  password: string;
  emailAddress: string;
  confirm_password: string;
};

export const SignupPage: React.FC<ModalProps> = (modalProps) => {
  const { t } = useTranslation('auth');
  const { referredby } = useTypedSelector((store) => store.referredby);

  const dispatch = useAppDispatch();

  const auth = useTypedSelector((state) => state.auth);

  const router = useRouter();

  const [state, setState] = useState<{
    showPassword: boolean;
  }>({
    showPassword: false,
  });

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { username: '', password: '' },
  });
  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      if (data.password !== data.confirm_password) {
        setError('password', { message: t('validation.password_invalid') });
        return;
      }

      if (referredby) {
        dispatch(signup({ ...data, referredBy: referredby }, router));
      } else {
        dispatch(signup(data, router));
      }
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <Modal
      {...modalProps}
      className="signup-modal"
      contentClass="signup-page"
      onClose={() => dispatch(closeAuthModal())}
    >
      <div className="content">
        <div className="header">
          <div className="title">{t('signup.register_title')}</div>
          <div className="description">
            {t('signup.already_have_account')}{' '}
            <span onClick={() => dispatch(openLoginModal())}>{t('signup.login_link_action')}</span>
          </div>
          <div className="form-title">{t('signup.or_register_email')}</div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            control={control}
            name="username"
            label={t('signup.username')}
            width="100%"
            rules={{
              required: t('validation.username_required'),
              pattern: {
                value: /^.{0,20}$/,
                message: t('validation.username_length'),
              },
            }}
          />
          <FormInput
            control={control}
            name="emailAddress"
            label={t('signup.email')}
            width="100%"
            rules={{
              required: t('validation.email_invalid'),
              pattern: {
                value: EmailValidationRegex,
                message: t('validation.email_invalid'),
              },
            }}
          />
          <FormInput
            control={control}
            name="password"
            label={t('signup.password')}
            type={state.showPassword ? 'text' : 'password'}
            width="100%"
            endfix={state.showPassword ? 'eye-off' : 'eye'}
            rules={{
              required: t('validation.password_invalid'),
            }}
            onEndFixClick={() => setState({ ...state, showPassword: !state.showPassword })}
          />
          <FormInput
            control={control}
            name="confirm_password"
            label={t('signup.repeat_password')}
            type="password"
            width="100%"
            rules={{
              required: t('validation.password_invalid'),
            }}
          />
          <Button
            type="submit"
            disabled={!!Object.keys(errors).length}
            loading={auth.loading}
            width="100%"
          >
            {t('signup.submit_register')}
          </Button>
          <div className="description">
            {t('signup.terms_accept')}
          </div>
        </form>
      </div>
    </Modal>
  );
};
