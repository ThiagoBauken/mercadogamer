import React, { useMemo } from 'react';
import { iconList } from '@utils';

interface Props extends IconProps {
  name: string;
}
export const Icon: React.FC<Props> = (props) => {
  const { name, color, size } = props;

  const list = useMemo(() => {
    return iconList();
  }, []);

  const component = useMemo(() => {
    return list[name];
  }, [list, name]);

  return (
    <div className="mercado-icon">
      {component && React.createElement(component, { color, size })}
    </div>
  );
};
