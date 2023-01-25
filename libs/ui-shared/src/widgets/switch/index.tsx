import { ThemeColor } from '@theme/color';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  --mercado-switch-bg-color: ${({ bgColor }) => bgColor};
`;

export const Switch: React.FC<SwitchProps> = (props) => {
  const { bgColor = ThemeColor.primary, value } = props;

  const [_value, setValue] = useState<boolean>(false);

  useEffect(() => {
    setValue(value);
  }, [value]);

  const onChange = (): void => {
    setValue(!_value);
    props.onChange && props.onChange(!value);
  };

  const classNames = useMemo(() => {
    const classes = ['mercado-switch'];
    _value && classes.push('active');
    return classes.join(' ');
  }, [_value]);

  return (
    <Container className={classNames} bgColor={bgColor} onClick={onChange}>
      <div className="circle"></div>
    </Container>
  );
};
