import { Button } from '@widgets/button';
import { Icon } from '@widgets/icon';
import { useState } from 'react';

export const PublicationTypeCard: React.FC<
  IPublicationCard & { onClick: (value: keyof typeof PublicationTypeEnum) => void }
> = ({ description, detail, icon, value, label, onClick }) => {
  const [collapse, setCollapse] = useState<boolean>(false);

  return (
    <div className={`publication-type-card ${value}`} onClick={() => onClick(value)}>
      <div className="main-content">
        <div className="icon">
          <Icon name={icon} />
        </div>
        <div className="content">
          <div className="title">{label}</div>
          <div className="description">{description}</div>
        </div>
      </div>
      <div
        className={`detail${collapse ? ' collapse' : ''}`}
        onClick={(event) => {
          event.stopPropagation();
          setCollapse(true);
        }}
      >
        <div className="content">
          {typeof detail === 'string' ? (
            detail
          ) : (
            <ul>
              {Array.isArray(detail) && detail.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          )}
          <Button full onClick={() => onClick(value)}>
            Seleccionar
          </Button>
        </div>
        <div className="dropdown">
          <Icon name="chevron-down" size={24} />
        </div>
      </div>
    </div>
  );
};
