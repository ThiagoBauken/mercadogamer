import { useMemo } from 'react';
import styled from 'styled-components';
import { OrderSetting } from '@utils';
import { Icon } from '@widgets/icon';

const Container = styled.div`
  color: ${({ bagdeColor }) => bagdeColor};
  background: ${(background) => background};
`;
type Props = {
  status: string;
  showIcon?: boolean;
  showBorder?: boolean;
};
export const OrderStatusBadge: React.FC<Props> = ({ status, showIcon, showBorder }) => {
  console.log(status, showIcon, showBorder);
  const classNames = useMemo<string>(() => {
    const classes = ['order-status-bagde'];
    showBorder && classes.push('show-border');
    return classes.join(' ');
  }, [showBorder]);

  return (
    <Container
      className={classNames}
      bagdeColor={OrderSetting.state[status]?.color}
      background={OrderSetting.state[status]?.background}
    >
      <div className="content">
        {showIcon && (
          <div className="icon">
            <Icon name={OrderSetting.state[status]?.icon} />
          </div>
        )}
        <div className="status">{OrderSetting.state[status]?.label}</div>
      </div>
    </Container>
  );
};
