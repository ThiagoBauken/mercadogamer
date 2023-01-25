import { useMemo } from 'react';
import styled from 'styled-components';
import { ThemeColor } from '@theme/color';

const Container = styled.label`
  --mercado-label-bg-color: ${({ bgColor }) => bgColor};
  --mercado-label-bg-color--hover: ${({ bgColor }) => `${bgColor}66`};
  --mercado-label-bg-color--10: ${({ bgColor }) => `${bgColor}1A`};
  --mercado-label-bg-color--20: ${({ bgColor }) => `${bgColor}33`};
  --mercado-label-radius: ${({ radius }) => radius}px;
`;

export const Label: React.FC<LabelProps> = (props) => {
  const { type = 'primary', bgColor = ThemeColor.primary, radius = 50, size = 'big' } = props;

  const classNames = useMemo(() => {
    const classes = ['mercado-label'];
    size && classes.push(size);
    type && classes.push(type);
    return classes.join(' ');
  }, [size, type]);

  return (
    <Container className={classNames} bgColor={bgColor} radius={radius}>
      <div className="background"></div>
      <div className="content">{props.children}</div>
    </Container>
  );
};
