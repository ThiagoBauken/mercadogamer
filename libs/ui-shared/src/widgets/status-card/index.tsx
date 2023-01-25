import { ThemeColor } from '@theme/color';
import { useMemo } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  --mercado-status-card-color: ${({ bgColor }) => bgColor};
  --mercado-status-card-opacity: ${({ opacity }) => opacity};
  border-radius: ${({ borderRadius }) => borderRadius};
  text-transform: ${({ textTransform }) => textTransform};
`;

export const StatusCard: React.FC<StatusCardProps> = ({
  borderRadius = 100,
  children,
  className,
  color = ThemeColor['gray-90'],
  opacity = 0.15,
  textTransform = 'capitalize',
}) => {
  const classNames = useMemo<string>(() => {
    const classes = ['mercado-status-card'];
    className && classes.push(className);
    return classes.join(' ');
  }, [className]);

  return (
    <Container
      className={classNames}
      bgColor={color}
      borderRadius={typeof borderRadius === 'string' ? borderRadius : `${borderRadius}px`}
      textTransform={textTransform}
      opacity={opacity}
    >
      <div className="content">{children}</div>
    </Container>
  );
};
