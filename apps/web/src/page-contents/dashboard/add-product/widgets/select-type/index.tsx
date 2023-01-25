import { ProductType } from '@utils';
import { Icon } from '@widgets/icon';

type Props = {
  value: keyof typeof ProductTypeEnum;
  onAction: (value: keyof typeof ProductTypeEnum) => void;
};

export const SelectProductType: React.FC<Props> = ({ value, onAction }) => {
  return (
    <div className="content select-product-type">
      <div className="title">Selecciona el tipo de producto</div>
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
