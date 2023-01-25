import { useTypedSelector } from '@store';
import { getFileFullUrl, madeBackgroundImageUrl } from '@utils';
import { UseFormReturn } from 'react-hook-form';
import { postFile } from '@utils';
import { useEffect, useMemo } from 'react';
import { FormInput, FormMultipleSelect, FormSelect, FormTextarea } from '@widgets/form';
import { WrapLabel } from '@widgets/wrap-label';
import { FileSelector } from '@widgets/file-selector';
import { Button } from '@widgets/button';
import { continents } from '@ui-shared/utils';

type Props = {
  formController: UseFormReturn<CreateProductModelType>;
  onAction: () => void;
};

export const ProductDetail: React.FC<Props> = ({ formController, onAction }) => {
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
        setError(field as keyof CreateProductModelType, { message: 'Este campo es obligatorio' });
        hasError = true;
      }
    });
    !hasError && onAction();
  };

  return (
    <div className="product-detail content">
      <div className="title">Completa la información del producto</div>
      <div className="content">
        <FormInput
          full
          control={control}
          name="name"
          label="Título de la publicación"
          placeholder="Nombre"
        />

        <FormTextarea
          full
          control={control}
          name="description"
          label="Descripción"
          placeholder="Nombre"
        />

        <WrapLabel label="Agregar imagen" width="100%">
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
            label="Plataforma"
            placeholder="Plataforma"
            items={platforms.map((item) => ({ label: item.name, value: item.id }))}
          />

          <FormSelect
            full
            control={control}
            name="category"
            label="Categoría"
            placeholder="Categoría"
            items={categories.map((item) => ({ label: item.name, value: item.id }))}
          />
        </div>

        <div className="area-category">
          <FormMultipleSelect
            full
            control={control}
            name="countries"
            label="Disponibilidad geográfica"
            placeholder="Países"
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
          <Button onClick={onCheckForm}>Continuar</Button>
        </div>
      </div>
    </div>
  );
};
