import styled from 'styled-components';
import { ThemeColor } from '@theme/color';
import { Icon } from '@widgets/icon';

const Container = styled.button`
  --mercado-icon-button-color: ${({ defaultColor }) => defaultColor};
  --mercado-icon-button-color--hover: ${({ hoverColor }) => `${hoverColor}`};
  width: ${({ width }) => width};
`;
export const IconButton: React.FC<IconButtonProps> = (props) => {
  const { icon, color = 'white', hoverColor = ThemeColor.primary, onClick } = props;
  return (
    <Container
      className="mercado-icon-button"
      onClick={onClick}
      defaultColor={color}
      hoverColor={hoverColor}
      type='button'
    >
      <Icon name={icon} />
    </Container>
  );
};
