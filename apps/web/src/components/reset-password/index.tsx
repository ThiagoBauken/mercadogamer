import { useForm } from 'react-hook-form';
import { Modal } from '@widgets/modal';
import { FormInput } from '@widgets/form';
import { Button } from '@widgets/button';
import { closeAuthModal, useAppDispatch } from '@store';
import { EmailValidationRegex, endpoints, post } from '@utils';
import React, { useState } from 'react';

type Props = ModalProps;

export const ResetPassword: React.FC<Props> = ({ open }) => {
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
      const result = await post(endpoints.resetPassword(username), {});
      setState({ ...state, loading: false, success: true });
    } catch (error) {
      setState({ ...state, loading: false, success: false });
      console.log(error);
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
            <div className="title">Recupero de contraseña</div>
            <div className="description">
              Te enviaremos un enlace que te permite establecer una nueva contraseña.
            </div>
          </div>
          <form className="content" onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              full
              label="E-mail"
              control={control}
              name="username"
              rules={{
                required: 'Este campo es obligatorio',
                pattern: {
                  value: EmailValidationRegex,
                  message: 'Introduce una contraseña.',
                },
              }}
            />

            <Button type="submit" full disabled={!watch('username')} loading={state.loading}>
              Iniciar sesión
            </Button>
          </form>

          <div className="return" onClick={onClose}>
            Volver
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="image-container"></div>
          <div className="title">Email enviado</div>
          <div className="description">
            Te enviamos un correo electrónico con un enlace que te permite establecer una nueva
            contraseña.
          </div>
          <Button full onClick={onClose}>
            Listo
          </Button>
        </React.Fragment>
      )}
    </Modal>
  );
};
