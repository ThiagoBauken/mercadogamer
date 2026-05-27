import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import {
  closeAuthModal,
  login,
  openResetPasswordModal,
  openSignupModal,
  useAppDispatch,
  useTypedSelector,
} from '@store';
import { useRouter } from 'next/router';

const Modal = dynamic(() => import('@widgets/modal').then(mod => mod.Modal), { ssr: false });
const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });
const FormInput = dynamic(() => import('@widgets/form').then(mod => mod.FormInput), { ssr: false });
const Switch = dynamic(() => import('@widgets/switch').then(mod => mod.Switch), { ssr: false });
const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

interface ModalProps {
  open: boolean;
}

type FormData = {
  username: string;
  password: string;
};

export const LoginPage: React.FC<ModalProps> = (modalProps) => {
  const { t } = useTranslation('auth');
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
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      dispatch(login(data, router));
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <Modal
      {...modalProps}
      contentClass="login-page"
      className="login-modal"
      onClose={() => dispatch(closeAuthModal())}
    >
      <div className="content">
        <div className="header">
          <div className="title">{t('login.title')}</div>
          <div className="description">
            {t('login.no_account')}{' '}
            <span onClick={() => dispatch(openSignupModal())}>{t('login.signup_link')}</span>
          </div>

          <div className="form-title">{t('login.or_login_email')}</div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {auth.error && (
            <div className="error-message">
              <Icon name="alert-triangle" />
              {t('login.error')}
            </div>
          )}
          <FormInput
            control={control}
            name="username"
            label={t('login.username')}
            width="100%"
            rules={{
              required: t('validation.email_or_username_required'),
            }}
          />
          <FormInput
            control={control}
            name="password"
            label={t('login.password')}
            type={state.showPassword ? 'text' : 'password'}
            width="100%"
            endfix={state.showPassword ? 'eye-off' : 'eye'}
            rules={{
              required: t('validation.password_invalid'),
            }}
            onEndFixClick={() => setState({ ...state, showPassword: !state.showPassword })}
          />
          <div className="remember-password">
            <Switch />
            {t('login.remember_password')}
          </div>
          <Button
            type="submit"
            disabled={!!Object.keys(errors).length}
            loading={auth.loading}
            width="100%"
          >
            {t('login.submit')}
          </Button>
          <div className="forgot-password" onClick={() => dispatch(openResetPasswordModal())}>
            {t('login.forgot_password')}
          </div>
        </form>
      </div>
    </Modal>
  );
};
