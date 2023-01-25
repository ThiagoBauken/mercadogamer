import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  closeAuthModal,
  login,
  openResetPasswordModal,
  openSignupModal,
  useAppDispatch,
  useTypedSelector,
} from '@store';
import { useRouter } from 'next/router';
import { Modal } from '@widgets/modal';
import { Icon } from '@widgets/icon';
import { FormInput } from '@widgets/form';
import { Switch } from '@widgets/switch';
import { Button } from '@widgets/button';

type FormData = {
  username: string;
  password: string;
};

export const LoginPage: React.FC<ModalProps> = (modalProps) => {
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
      console.log(error);
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
          <div className="title">Iniciar sesión</div>
          <div className="description">
            ¿Aún no tenés una cuenta?{' '}
            <span onClick={() => dispatch(openSignupModal())}>Regístrate</span>
          </div>

          <div className="form-title">O ingresa con tu email</div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {auth.error && (
            <div className="error-message">
              <Icon name="alert-triangle" />
              E-mail o contraseña incorretos.
            </div>
          )}
          <FormInput
            control={control}
            name="username"
            label="E-mail o username"
            width="100%"
            rules={{
              required: 'Introduce un e-mail o username válido.',
            }}
          />
          <FormInput
            control={control}
            name="password"
            label="Contraseña"
            type={state.showPassword ? 'text' : 'password'}
            width="100%"
            endfix={state.showPassword ? 'eye-off' : 'eye'}
            rules={{
              required: 'Introduce una contraseña.',
            }}
            onEndFixClick={() => setState({ ...state, showPassword: !state.showPassword })}
          />
          <div className="remember-password">
            <Switch />
            Recordar contraseña
          </div>
          <Button
            type="submit"
            disabled={!!Object.keys(errors).length}
            loading={auth.loading}
            width="100%"
          >
            Iniciar sesión
          </Button>
          <div className="forgot-password" onClick={() => dispatch(openResetPasswordModal())}>
            ¿Olvidaste tu contraseña?
          </div>
        </form>
      </div>
    </Modal>
  );
};
