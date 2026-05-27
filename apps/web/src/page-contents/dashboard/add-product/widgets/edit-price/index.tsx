// @ts-nocheck - TypeScript compatibility fix
import { UseFormReturn } from 'react-hook-form';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ProductFunctions, toUSDandCurrency } from '@utils';
import { useTranslation } from 'next-i18next';




type Props = {
  formController: UseFormReturn<CreateProductModelType, any>;
};


const FormInput = dynamic(() => import('@widgets/form').then(mod => mod.FormInput), { ssr: false });

const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

export const EditPrice: React.FC<Props> = ({ formController }) => {
  const { t } = useTranslation('dashboard');
  const { control, setValue, watch } = formController;

  useEffect(() => {
    const data = ProductFunctions.caculateCommission(watch('price'), watch('publicationType'));
    Object.keys(data).forEach((key) => setValue(key as keyof CreateProductModelType, data[key]));
  }, [watch('price')]);

  return (
    <div className="edit-price content">
      <div className="title">
        <div className="label">{t('add_product.pricing.title')}</div>
        <div className="description">
          {t('add_product.pricing.hint')}
        </div>
      </div>
      <div className="content">
        <div className="edit-price-content">
          <div className="header">
            <div className="label">{t('add_product.pricing.price_usd')}</div>
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
            <div className="label">{t('add_product.pricing.you_receive')}</div>
            <div
              className="flag"
              style={{ backgroundImage: `url(https://flagcdn.com/w40/ar.png)` }}
            ></div>
          </div>
          <div className="info">
            <div className="item">
              <div className="label">{t('add_product.pricing.conversion')}</div>
              <div className="value">{toUSDandCurrency(watch('price'))}</div>
            </div>
            <div className="item">
              <div className="label">{t('add_product.pricing.normal_commission')}</div>
              <div className="value">
                {toUSDandCurrency(watch('commission') + Number(watch('iva')))}
              </div>
            </div>
            <div className="item total">
              <div className="label">{t('add_product.pricing.profit')}</div>
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
              <div className="description">{t('add_product.pricing.mg_guarantee')}</div>
            </div>
            <div className="item">
              <div className="icon">
                <Icon name="payment-logo" />
              </div>
              <div className="description">{t('add_product.pricing.secure_payment')}</div>
            </div>
          </div>
        </div>

        <div className="action">
          <Button type="submit">{t('add_product.pricing.publish')}</Button>
        </div>
      </div>
    </div>
  );
};
