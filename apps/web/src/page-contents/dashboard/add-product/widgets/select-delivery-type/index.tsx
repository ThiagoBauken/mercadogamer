// @ts-nocheck - TypeScript compatibility fix





import React, { useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'next-i18next';

type Props = {
  formController: UseFormReturn<CreateProductModelType, any>;
  onAction: () => void;
};


const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

const FormInput = dynamic(() => import('@widgets/form').then(mod => mod.FormInput), { ssr: false });

const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

const IconButton = dynamic(() => import('@widgets/icon-button').then(mod => mod.IconButton), { ssr: false });

const WrapLabel = dynamic(() => import('@widgets/wrap-label').then(mod => mod.WrapLabel), { ssr: false });

export const SelectDeliveryType: React.FC<Props> = ({ formController, onAction }) => {
  const { t } = useTranslation('dashboard');
  const { control, setValue, watch } = formController;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'code', // unique name for your Field Array
  });

  useEffect(() => {
    if (!watch('retirementType')) {
      setRetiremenetType('automatic');
    }
    if (!fields.length) append('');
  }, [JSON.stringify(watch())]);

  const setRetiremenetType = (value: keyof typeof RetirementTypesEnum): void => {
    setValue('retirementType', value);
  };

  const retirementTypes = useMemo<{ label: string; value: keyof typeof RetirementTypesEnum }[]>(
    () => [
      { label: t('add_product.delivery_type.automatic'), value: 'automatic' },
      { label: t('add_product.delivery_type.coordinated'), value: 'coordinated' },
    ],
    [t]
  );
  return (
    <div className="select-delivery-type content">
      <div className="title">{t('add_product.delivery_type.title')}</div>
      <div className="content">
        <ul className="select-delivery">
          {retirementTypes.map((item) => (
            <li
              key={item.value}
              className={watch('retirementType') === item.value ? 'active' : ''}
              onClick={() => setRetiremenetType(item.value)}
            >
              {item.label}
            </li>
          ))}
        </ul>
        <div className="edit-content">
          {watch('retirementType') === 'automatic' ? (
            <React.Fragment>
              <WrapLabel label={t('add_product.delivery_type.product_key')} className="edit-code" width="100%">
                {fields.map((field, index) => (
                  <div className="record" key={field.id}>
                    <FormInput
                      control={control}
                      name={`code.${index}.value`}
                      placeholder={t('add_product.product_detail.name')}
                      full
                    />
                    <IconButton icon="close" onClick={() => remove(index)} />
                  </div>
                ))}
              </WrapLabel>
              <div className="action" onClick={() => append('')}>
                <div className="icon">
                  <Icon name="plus-circle" />
                </div>
                <div className="label">{t('add_product.delivery_type.add')}</div>
              </div>
            </React.Fragment>
          ) : (
            <FormInput control={control} name="stock" label={t('add_product.delivery_type.stock')} type="number" full />
          )}
        </div>

        <div className="action">
          <Button onClick={onAction}>{t('add_product.delivery_type.continue')}</Button>
        </div>
      </div>
    </div>
  );
};
