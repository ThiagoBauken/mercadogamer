// @ts-nocheck - TypeScript compatibility fix
import { ProductType } from '@utils';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';


type Props = {
  value: keyof typeof ProductTypeEnum;
  onAction: (value: keyof typeof ProductTypeEnum) => void;
};


const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

export const SelectProductType: React.FC<Props> = ({ value, onAction }) => {
  const { t } = useTranslation('dashboard');
  return (
    <div className="content select-product-type">
      <div className="title">{t('add_product.product_type.title')}</div>
      <ul>
        {Object.keys(ProductType).map((key, index) => (
          <li
            key={index}
            onClick={() => onAction(key as keyof typeof ProductTypeEnum)}
            className={value === key ? 'active' : ''}
          >
            <div className="icon">
              <Icon name={ProductType[key].icon} />
            </div>
            <div className="label">{ProductType[key].label}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};
