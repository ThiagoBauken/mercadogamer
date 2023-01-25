import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { closeAuthModal, openLoginModal, signup, useAppDispatch, useTypedSelector } from '@store';
import { useRouter } from 'next/router';
import { addMessageToToast, EmailValidationRegex } from '@utils';
import { Modal } from '@widgets/modal';
import { FormInput } from '@widgets/form';
import { Button } from '@widgets/button';

type FormData = {
  username: string;
  password: string;
  emailAddress: string;
  confirm_password: string;
};

export const SignupPage: React.FC<ModalProps> = (modalProps) => {
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
        setError('password', { message: 'Introduce una contraseña.' });
        return;
      }

      if (referredby) {
        dispatch(signup({ ...data, referredBy: referredby }, router));
      } else {
        dispatch(signup(data, router));
      }
    } catch (error) {
      console.log(error);
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
          <div className="title">Registrate</div>
          <div className="description">
            ¿Ya tenés una cuenta?{' '}
            <span onClick={() => dispatch(openLoginModal())}>Iniciar sesión</span>
          </div>
          <div className="form-title">O registrate con tu email</div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            control={control}
            name="username"
            label="Nombre de usuario"
            width="100%"
            rules={{
              required: 'Introduce un nombre valido. Debe tener entre 0 y 20 caracteres.',
              pattern: {
                value: /^.{0,20}$/,
                message: 'El nombre de usuario tiene que tener entre 0 y 20 caracteres.',
              },
            }}
          />
          <FormInput
            control={control}
            name="emailAddress"
            label="E-mail"
            width="100%"
            rules={{
              required: 'Introduce un e-mail válido.',
              pattern: {
                value: EmailValidationRegex,
                message: 'Introduce un e-mail válido.',
              },
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
          <FormInput
            control={control}
            name="confirm_password"
            label="Repetir contraseña"
            type="password"
            width="100%"
            rules={{
              required: 'Introduce una contraseña.',
            }}
          />
          <Button
            type="submit"
            disabled={!!Object.keys(errors).length}
            loading={auth.loading}
            width="100%"
          >
            Registrate
          </Button>
          <div className="description">
            Al registrarte aceptás las Condiciones de uso y la Política de privacidad de Mercado
            Gamer.
          </div>
        </form>
      </div>
    </Modal>
  );
};
