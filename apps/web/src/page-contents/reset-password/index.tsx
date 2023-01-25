import { useState } from 'react';
import { Loading } from '@widgets/loading';
import { useForm } from 'react-hook-form';
import { FormInput } from '@widgets/form';
import { Button } from '@widgets/button';
import { useRouter } from 'next/router';
import { endpoints, put } from '@utils';

type FormData = { password: string; confirmPassword: string };

export const ResetPasswordPageContent: React.FC = () => {
  const [state, setState] = useState<{
    success: boolean;
    loading: boolean;
    showPassword: boolean;
    confirmPassword: boolean;
  }>({
    loading: false,
    success: false,
    showPassword: false,
    confirmPassword: false,
  });
  const router = useRouter();

  const { control, handleSubmit, watch } = useForm<FormData>();

  const onSubmit = async (data: FormData): Promise<void> => {
    setState({ ...state, loading: true });
    try {
      const result = await put(endpoints.changePasswordUrl, { ...data, token: router.query.token });
      setState({ ...state, success: true, loading: false });
    } catch (error) {
      setState({ ...state, success: false, loading: false });
    }
  };

  return (
    <section className="reset-password-page-content">
      <Loading loading={state.loading} />
      <div className="content">
        {!state.success ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="header">
              <div className="title">Nueva contraseña</div>
              <div className="description">Introduce una nueva contraseña para tu cuenta.</div>
            </div>
            <FormInput
              full
              control={control}
              name="password"
              label="Contraseña"
              type={state.showPassword ? 'text' : 'password'}
              endfix={state.showPassword ? 'eye-off' : 'eye'}
              onEndFixClick={() => setState({ ...state, showPassword: !state.showPassword })}
            />

            <FormInput
              full
              control={control}
              name="confirmPassword"
              label="Repetir contraseña"
              type={state.confirmPassword ? 'text' : 'password'}
              endfix={state.confirmPassword ? 'eye-off' : 'eye'}
              onEndFixClick={() => setState({ ...state, confirmPassword: !state.confirmPassword })}
            />

            <Button
              full
              type="submit"
              disabled={
                !watch('password') ||
                ((!state.showPassword || !state.confirmPassword) &&
                  watch('password') !== watch('confirmPassword'))
              }
            >
              Confirmar
            </Button>
          </form>
        ) : (
          <div className="sucess-content">
            <div className="image-container"></div>
            <div className="title">Contraseña reestablecida</div>
            <div className="description">Ya podés ingresar con tu nueva contraseña.</div>
            <Button full onClick={() => router.push('/home')}>
              Ingresar
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
