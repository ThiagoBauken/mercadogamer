import { Icon } from '@widgets/icon';

export const BreadCrumb: React.FC<BreadCrumbProps> = (props) => {
  const { items } = props;
  return (
    <ul className="mercado-bread-crumb">
      {Array.isArray(items) &&
        items.map((item, index) => (
          <li className="item" key={index} onClick={() => item.action && item.action()}>
            <div className="spin">
              <Icon name="chevron-right" />
            </div>
            <div className="label">{typeof item === 'string' ? item : item.label}</div>
          </li>
        ))}
    </ul>
  );
};
