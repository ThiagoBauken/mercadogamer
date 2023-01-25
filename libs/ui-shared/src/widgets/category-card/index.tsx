import { useMemo } from 'react';
import styled from 'styled-components';
import { ThemeColor } from '@theme/color';

const Container = styled.div`
  --mercado-categorycard-bg-color: ${({ bgColor }) => bgColor};
  --mercado-categorycard-bg-color--hover: ${({ bgColor }) => `${bgColor}66`};
  --mercado-categorycard-radius: ${({ radius }) => radius}px;
`;

export const CategroyCard: React.FC<CategroyCardProps> = (props) => {
  const { type = 'default', bgColor = ThemeColor['gray-110'], radius = 5, size = 'normal' } = props;
  const classNames = useMemo(() => {
    const classes = ['mercado-categorycard'];
    size && classes.push(size);
    type && classes.push(type);
    return classes.join(' ');
  }, [size, type]);

  return (
    <Container className={classNames} bgColor={bgColor} radius={radius} onClick={props.onClick}>
      <div className="background"></div>
      <div className="content">{props.children}</div>
    </Container>
  );
};
