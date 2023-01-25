import { ThemeColor } from '@theme/color';
import { useMemo } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  --mercado-card-bg-color: ${({ bgColor }) => bgColor};
  --mercado-card-border-color: ${({ borderColor }) => borderColor};
  --mercado-card-radius: ${({ radius }) => radius}px;
  width: ${({ width }) => width};
`;

export const Card: React.FC<CardProps> = ({
  bgColor = ThemeColor['gray-120'],
  borderColor = ThemeColor['gray-100'],
  radius = 8,
  width = '100%',
  children,
  className,
}) => {
  const classNames = useMemo<string>(() => {
    const classes = ['mercado-card'];
    className && classes.push(className);
    return classes.join(' ');
  }, [className]);

  return (
    <Container
      className={classNames}
      bgColor={bgColor}
      borderColor={borderColor}
      radius={radius}
      width={typeof width === 'string' ? width : `${width}px`}
    >
      {children}
    </Container>
  );
};
