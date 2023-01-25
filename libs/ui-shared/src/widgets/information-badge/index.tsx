import { Icon } from '@widgets/icon';
import styled from 'styled-components';

const Container = styled.div`
  --mercado-information-badge-color: ${({ bgColor }) => bgColor};
`;

export const InformationBadge: React.FC<InformationBadgeProps> = ({ icon, color, children }) => {
  return (
    <Container className="mercado-information-badge" bgColor={color}>
      <div className="content">
        {icon && <Icon name={icon} size={16} />}
        <div className="main">{children}</div>
      </div>
    </Container>
  );
};
