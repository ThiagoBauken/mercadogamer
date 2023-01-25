import { ThemeColor } from '@theme/color';
import styled from 'styled-components';

type Props = {
  loading?: boolean;
  text?: string;
  color?: string;
  size?: string | number;
  position?: 'fixed' | 'absolute' | 'relative';
  background?: string;
};

const Container = styled.div`
  position: ${({ position }) => position};
  --loading-color: ${(props) => props.color || 'var(--text-primary)'};
  --loading-size: ${(props) => (typeof props.size == 'number' ? `${props.size}px` : props.size)};
`;

export const Loading: React.FC<Props> = ({
  text = '',
  color = ThemeColor.primary,
  size = 80,
  loading = true,
  position = 'fixed',
  background = ThemeColor['gray-130']
}) =>
  loading ? (
    <Container style={{ background }} className="mercado-loading" color={color} size={size} position={position}>
      <span className="spinner"></span>
      {text && <span className="text">{text}</span>}
    </Container>
  ) : null;
