import { UseFormReturn } from 'react-hook-form';
import { useEffect } from 'react';
import { ProductFunctions, toUSDandCurrency } from '@utils';
import { FormInput } from '@widgets/form';
import { Icon } from '@widgets/icon';
import { Button } from '@widgets/button';

type Props = {
  formController: UseFormReturn<CreateProductModelType, any>;
};

export const EditPrice: React.FC<Props> = ({ formController }) => {
  const { control, setValue, watch } = formController;

  useEffect(() => {
    const data = ProductFunctions.caculateCommission(watch('price'), watch('publicationType'));
    Object.keys(data).forEach((key) => setValue(key as keyof CreateProductModelType, data[key]));
  }, [watch('price')]);

  return (
    <div className="edit-price content">
      <div className="title">
        <div className="label">Selecciona el precio</div>
        <div className="description">
          El precio en dólares es únicamente para ventas internacionales, los usuarios de Argentina
          verán el precio en pesos argentinos.
        </div>
      </div>
      <div className="content">
        <div className="edit-price-content">
          <div className="header">
            <div className="label">Precio en USD</div>
            <div
              className="flag"
              style={{ backgroundImage: `url(https://flagcdn.com/w40/us.png)` }}
            ></div>
          </div>
          <div className="edit-price-input">
            <div className="prefix">$</div>
            <FormInput control={control} name="price" full placeholder="0.00" />
          </div>
        </div>
        <div className="product-info">
          <div className="header">
            <div className="label">Recibirás (ARS)</div>
            <div
              className="flag"
              style={{ backgroundImage: `url(https://flagcdn.com/w40/ar.png)` }}
            ></div>
          </div>
          <div className="info">
            <div className="item">
              <div className="label">Conversión</div>
              <div className="value">{toUSDandCurrency(watch('price'))}</div>
            </div>
            <div className="item">
              <div className="label">Comisión normal</div>
              <div className="value">
                {toUSDandCurrency(watch('commission') + Number(watch('iva')))}
              </div>
            </div>
            <div className="item total">
              <div className="label">Ganancia</div>
              <div className="value">
                {toUSDandCurrency(
                  Number(watch('price')) - (Number(watch('commission')) + Number(watch('iva')))
                )}
              </div>
            </div>
          </div>
          <div className="helper">
            <div className="item">
              <div className="icon">
                <Icon name="mg-logo" />
              </div>
              <div className="description">Venta protegida por Garantía MG</div>
            </div>
            <div className="item">
              <div className="icon">
                <Icon name="payment-logo" />
              </div>
              <div className="description">Cobro seguro con MercadoPago</div>
            </div>
          </div>
        </div>

        <div className="action">
          <Button type="submit">Publicar</Button>
        </div>
      </div>
    </div>
  );
};
