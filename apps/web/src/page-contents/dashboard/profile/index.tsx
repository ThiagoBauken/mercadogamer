// @ts-nocheck - TypeScript compatibility fix
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
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




import { useTranslation } from 'next-i18next';


const FileSelector = dynamic(() => import('@widgets/file-selector').then(mod => mod.FileSelector), { ssr: false });

const FormInput = dynamic(() => import('@widgets/form').then(mod => mod.FormInput), { ssr: false });
const FormSelect = dynamic(() => import('@widgets/form').then(mod => mod.FormSelect), { ssr: false });

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

export const ProfilePageContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('dashboard');

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
      addMessageToToast(t('profile.save_success'), {
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
      <div className="title">{t('profile.title')}</div>
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
            <div className="message">{t('profile.upload_photo.message')}</div>
            <div className="description">{t('profile.upload_photo.description')}</div>
          </div>
        </div>

        <div className="edit-form">
          <div className="row">
            <FormInput
              control={control}
              name="firstName"
              placeholder={t('profile.placeholders.first_name')}
              label={t('profile.fields.first_name')}
              full
              rules={{ required: t('profile.validations.required') }}
            />

            <FormInput
              control={control}
              name="lastName"
              placeholder={t('profile.placeholders.last_name')}
              label={t('profile.fields.last_name')}
              full
              rules={{ required: t('profile.validations.required') }}
            />
          </div>

          <FormInput
            control={control}
            name="username"
            placeholder={t('profile.placeholders.username')}
            label={t('profile.fields.username')}
            full
            rules={{
              required: t('profile.validations.required'),
              pattern: {
                value: /^.{0,20}$/,
                message: t('profile.validations.username_length'),
              },
            }}
          />

          <FormInput
            control={control}
            name="address"
            placeholder={t('profile.placeholders.address')}
            label={t('profile.fields.address')}
            full
            rules={{ required: t('profile.validations.required') }}
          />

          <div className="row">
            <FormInput
              control={control}
              name="city"
              placeholder={t('profile.placeholders.city')}
              label={t('profile.fields.city')}
              full
              // rules={{
              //   required: t('profile.validations.required'),
              // }}
            />

            <FormSelect
              control={control}
              name="province"
              placeholder={t('profile.placeholders.province')}
              label={t('profile.fields.province')}
              items={provinces.map((i) => ({ label: i, value: i }))}
              full
              rules={{ required: t('profile.validations.required') }}
            />
          </div>

          <div className="row">
            <FormInput
              control={control}
              name="postalCode"
              placeholder={t('profile.placeholders.postal_code')}
              label={t('profile.fields.postal_code')}
              type="number"
              full
              // rules={{
              //   required: t('profile.validations.required'),
              // }}
            />

            <FormSelect
              control={control}
              name="country"
              placeholder={t('profile.placeholders.country')}
              label={t('profile.fields.country')}
              items={countries.map((item) => ({ label: item.name, value: item.id }))}
              full
              rules={{ required: t('profile.validations.required') }}
            />
          </div>

          <FormInput
            control={control}
            name="phoneNumber"
            placeholder={t('profile.placeholders.phone')}
            label={t('profile.fields.phone')}
            full
            rules={{ required: t('profile.validations.required') }}
          />

          <FormInput
            control={control}
            name="emailAddress"
            placeholder={t('profile.placeholders.email')}
            label={t('profile.fields.email')}
            full
            rules={{
              required: t('profile.validations.required'),
              pattern: {
                value: EmailValidationRegex,
                message: t('profile.validations.invalid_email'),
              },
            }}
          />
        </div>

        <div className="action">
          <Button type="submit">{t('profile.save_button')}</Button>
        </div>
      </form>
    </section>
  );
};
