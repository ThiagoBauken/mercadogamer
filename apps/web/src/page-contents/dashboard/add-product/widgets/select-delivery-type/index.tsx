import { Button } from '@widgets/button';
import { FormInput } from '@widgets/form';
import { Icon } from '@widgets/icon';
import { IconButton } from '@widgets/icon-button';
import { WrapLabel } from '@widgets/wrap-label';
import React, { useEffect, useMemo } from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';

type Props = {
  formController: UseFormReturn<CreateProductModelType, any>;
  onAction: () => void;
};

export const SelectDeliveryType: React.FC<Props> = ({ formController, onAction }) => {
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
      { label: 'Entrega automática', value: 'automatic' },
      { label: 'Entrega coordinada', value: 'coordinated' },
    ],
    []
  );
  return (
    <div className="select-delivery-type content">
      <div className="title">Selecciona el tipo de entrega</div>
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
              <WrapLabel label="Clave del producto" className="edit-code" width="100%">
                {fields.map((field, index) => (
                  <div className="record" key={field.id}>
                    <FormInput
                      control={control}
                      name={`code.${index}.value`}
                      placeholder="Nombre"
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
                <div className="label">Agregar</div>
              </div>
            </React.Fragment>
          ) : (
            <FormInput control={control} name="stock" label="Stock" type="number" full />
          )}
        </div>

        <div className="action">
          <Button onClick={onAction}>Continuar</Button>
        </div>
      </div>
    </div>
  );
};
