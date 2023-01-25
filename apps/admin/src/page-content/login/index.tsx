import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { Icon } from '@widgets/icon';
import { FormInput } from '@widgets/form';
import { Switch } from '@widgets/switch';
import { Button } from '@widgets/button';
import { login, useAppDispatch, useTypedSelector } from '@admin/store';

type FormData = {
  username: string;
  password: string;
};

export const LoginPageContent: React.FC = () => {
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
    <section className="login-page-content">
      <div className="content">
        <div className="header">
          <div className="title">Iniciar sesión</div>
          <div className="description">
            ¿Aún no tenés una cuenta? <span>Regístrate</span>
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
            label="E-mail"
            width="100%"
            rules={{
              required: 'Introduce un e-mail válido.',
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
          <div className="forgot-password">¿Olvidaste tu contraseña?</div>
        </form>
      </div>
    </section>
  );
};
