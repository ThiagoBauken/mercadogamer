import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { updateUser, useAppDispatch, useTypedSelector } from '@store';
import {
  addMessageToToast,
  EmailValidationRegex,
  endpoints,
  getFileFullUrl,
  madeBackgroundImageUrl,
  postFile,
  put,
} from '@utils';
import { ThemeColor } from '@theme/color';
import { FileSelector } from '@widgets/file-selector';
import { FormInput, FormSelect } from '@widgets/form';
import { Button } from '@widgets/button';
import { Icon } from '@widgets/icon';

export const ProfilePageContent: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    auth: { user },
    country: { countries },
  } = useTypedSelector((store) => store);

  const { control, handleSubmit, setValue, reset, watch } = useForm<UserModelType>();

  const [state, setState] = useState<{ file: File }>({ file: null });

  useEffect(() => {
    user &&
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
        username: user.username,
        address: user.address,
        postalCode: user.postalCode,
        country: user.country,
        phoneNumber: user.phoneNumber,
        emailAddress: user.emailAddress,
        city: user.city,
        province: user.province,
      });
  }, [reset, user]);

  useEffect(() => {
    uploadFile();
  }, [state.file]);

  const uploadFile = async (): Promise<void> => {
    if (!state.file) return;
    try {
      const response = await postFile(state.file);
      setValue('picture', response.data?.data?.file || '');
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (userInfo: UserModelType): Promise<void> => {
    try {
      const response = await put<UserModelType, UserModelType>(endpoints.userUrl, userInfo);
      dispatch(updateUser(response.data));
      addMessageToToast('Se han guardado los cambios.', {
        status: 'success',
        icon: 'check-circle',
      });
    } catch (error) {
      console.log(error);
    }
  };

  const watchCountry = watch('country');

  const [provinces, setProvinces] = useState<string[]>([]);
  useEffect(() => {
    const country = watchCountry;

    if (country && countries.length > 0) {
      const provinces = countries.find((c) => c.id === country).provinces;

      if (provinces) {
        setProvinces(provinces);
      }
    }
  }, [watchCountry, countries]);

  return (
    <section className="profile-page-content">
      <div className="title">Mi perfil</div>
      <form className="content" onSubmit={handleSubmit(onSubmit)}>
        <div className="edit-avatar">
          <FileSelector
            onChange={(value) => setState({ ...state, file: value })}
            renderButton={
              <div
                className="avatar"
                style={{
                  backgroundImage: madeBackgroundImageUrl(getFileFullUrl(watch('picture'))),
                }}
              >
                <Icon name="camera" size={36} color={ThemeColor['gray-50']} />
              </div>
            }
            disableMessage
            disableReset
          ></FileSelector>
          <div className="content">
            <div className="message">Todavía no cargaste una foto de perfil</div>
            <div className="description">Haz click para subir una imagen.</div>
          </div>
        </div>

        <div className="edit-form">
          <div className="row">
            <FormInput
              control={control}
              name="firstName"
              placeholder="Nombre"
              label="Nombre"
              full
              rules={{ required: 'Este campo es obligatorio' }}
            />

            <FormInput
              control={control}
              name="lastName"
              placeholder="Apellido"
              label="Apellido"
              full
              rules={{ required: 'Este campo es obligatorio' }}
            />
          </div>

          <FormInput
            control={control}
            name="username"
            placeholder="Nombre de usuario"
            label="Nombre de usuario"
            full
            rules={{
              required: 'Este campo es obligatorio',
              pattern: {
                value: /^.{0,20}$/,
                message: 'El nombre de usuario tiene que tener entre 0 y 20 caracteres.',
              },
            }}
          />

          <FormInput
            control={control}
            name="address"
            placeholder="Dirección"
            label="Dirección"
            full
            rules={{ required: 'Este campo es obligatorio' }}
          />

          <div className="row">
            <FormInput
              control={control}
              name="city"
              placeholder="Ciudad"
              label="Ciudad"
              full
              // rules={{
              //   required: 'This field is required',
              // }}
            />

            <FormSelect
              control={control}
              name="province"
              placeholder="Seleccionar"
              label="Provincia"
              items={provinces.map((i) => ({ label: i, value: i }))}
              full
              rules={{ required: 'Este campo es obligatorio' }}
            />
          </div>

          <div className="row">
            <FormInput
              control={control}
              name="postalCode"
              placeholder="Código postal"
              label="Código postal"
              type="number"
              full
              // rules={{
              //   required: 'This field is required',
              // }}
            />

            <FormSelect
              control={control}
              name="country"
              placeholder="Seleccionar"
              label="País"
              items={countries.map((item) => ({ label: item.name, value: item.id }))}
              full
              rules={{ required: 'Este campo es obligatorio' }}
            />
          </div>

          <FormInput
            control={control}
            name="phoneNumber"
            placeholder="Teléfono"
            label="Teléfono"
            full
            rules={{ required: 'Este campo es obligatorio' }}
          />

          <FormInput
            control={control}
            name="emailAddress"
            placeholder="E-mail"
            label="E-mail"
            full
            rules={{
              required: 'Este campo es obligatorio',
              pattern: {
                value: EmailValidationRegex,
                message: 'Introduce una contraseña.',
              },
            }}
          />
        </div>

        <div className="action">
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </section>
  );
};
