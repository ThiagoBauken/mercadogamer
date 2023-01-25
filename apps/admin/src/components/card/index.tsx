import { madeBackgroundImageUrl } from '@utils';

type Props = {
  contentClass?: string;
  title?: string;
  picture?: string;
  values?: (string | number)[];
  description?: string;
} & ChildrenProps;

export const Card: React.FC<Props> = ({
  contentClass,
  title,
  picture,
  values,
  description,
  children,
}) => {
  return (
    <div className="card">
      <div className="header">
        <div className="title">{title}</div>
        {picture && (
          <div
            className="icon"
            style={{ backgroundImage: madeBackgroundImageUrl(`/assets/imgs/${picture}`) }}
          ></div>
        )}
      </div>
      <div className={`content${contentClass ? ` ${contentClass}` : ''}`}>
        {values && values.length && (
          <ul className="values">
            {values.map((value, index) => (
              <li key={index}>{value}</li>
            ))}
          </ul>
        )}
        {description && <div className="description">{description}</div>}
        {children}
      </div>
    </div>
  );
};
