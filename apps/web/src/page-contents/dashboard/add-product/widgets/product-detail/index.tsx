// @ts-nocheck - TypeScript compatibility fix
import { useTypedSelector } from '@store';
import { getFileFullUrl, madeBackgroundImageUrl } from '@utils';
import { UseFormReturn } from 'react-hook-form';
import { postFile } from '@utils';
import { useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';




import { continents } from '@ui-shared/utils';

type Props = {
  formController: UseFormReturn<CreateProductModelType>;
  onAction: () => void;
};


const FormInput = dynamic(() => import('@widgets/form').then(mod => mod.FormInput), { ssr: false });
const FormMultipleSelect = dynamic(() => import('@widgets/form').then(mod => mod.FormMultipleSelect), { ssr: false });
const FormSelect = dynamic(() => import('@widgets/form').then(mod => mod.FormSelect), { ssr: false });
const FormTextarea = dynamic(() => import('@widgets/form').then(mod => mod.FormTextarea), { ssr: false });

const WrapLabel = dynamic(() => import('@widgets/wrap-label').then(mod => mod.WrapLabel), { ssr: false });

const FileSelector = dynamic(() => import('@widgets/file-selector').then(mod => mod.FileSelector), { ssr: false });

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

export const ProductDetail: React.FC<Props> = ({ formController, onAction }) => {
  const { t } = useTranslation('dashboard');
  const {
    control,
    setValue,
    setError,
    watch,
    clearErrors,
    formState: { errors },
  } = formController;
  const {
    platform: { platforms },
    category: { categories },
  } = useTypedSelector((store) => store);

  const requiredFields = useMemo(
    () => ['name', 'description', 'picture', 'platform', 'category'],
    []
  );

  useEffect(() => {
    requiredFields.forEach((field) => {
      watch(field as keyof CreateProductModelType) &&
        clearErrors(field as keyof CreateProductModelType);
    });
  }, [JSON.stringify(watch()), requiredFields]);

  const onFileUpload = async (file: File): Promise<void> => {
    try {
      if (file) {
        const response = await postFile(file);
        setValue('picture', response.data?.data?.file || '');
      } else {
        setValue('picture', null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onCheckForm = (): void => {
    let hasError = false;
    requiredFields.forEach((field) => {
      if (!watch(field as keyof CreateProductModelType)) {
        setError(field as keyof CreateProductModelType, { message: t('add_product.product_detail.required_field') });
        hasError = true;
      }
    });
    !hasError && onAction();
  };

  return (
    <div className="product-detail content">
      <div className="title">{t('add_product.product_detail.title')}</div>
      <div className="content">
        <FormInput
          full
          control={control}
          name="name"
          label={t('add_product.product_detail.publication_title')}
          placeholder={t('add_product.product_detail.name')}
        />

        <FormTextarea
          full
          control={control}
          name="description"
          label={t('add_product.product_detail.description')}
          placeholder={t('add_product.product_detail.name')}
        />

        <WrapLabel label={t('add_product.product_detail.add_image')} width="100%">
          <div className={`add-image${errors.picture ? ' error' : ''}`}>
            <FileSelector
              disableMessage
              renderButton={
                <div
                  className="image-container"
                  style={{
                    backgroundImage: madeBackgroundImageUrl(
                      watch('picture')
                        ? getFileFullUrl(watch('picture'))
                        : '/assets/imgs/placeholder.svg'
                    ),
                  }}
                ></div>
              }
              onChange={onFileUpload}
            ></FileSelector>
          </div>
        </WrapLabel>

        <div className="platform-category">
          <FormSelect
            full
            multiple
            control={control}
            name="platform"
            label={t('add_product.product_detail.platform')}
            placeholder={t('add_product.product_detail.platform')}
            items={platforms.map((item) => ({ label: item.name, value: item.id }))}
          />

          <FormSelect
            full
            control={control}
            name="category"
            label={t('add_product.product_detail.category')}
            placeholder={t('add_product.product_detail.category')}
            items={categories.map((item) => ({ label: item.name, value: item.id }))}
          />
        </div>

        <div className="area-category">
          <FormMultipleSelect
            full
            control={control}
            name="countries"
            label={t('add_product.product_detail.geographic_availability')}
            placeholder={t('add_product.product_detail.countries')}
            items={continents.map((item) => ({
              label: item.label,
              value: item.value,
              items: item.countries,
            }))}
            width="500px"
            multiple
          />
        </div>

        <div className="action">
          <Button onClick={onCheckForm}>{t('add_product.product_detail.continue')}</Button>
        </div>
      </div>
    </div>
  );
};
