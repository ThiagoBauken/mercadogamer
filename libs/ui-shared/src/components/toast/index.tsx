import { Button } from '@widgets/button';
import { Icon } from '@widgets/icon';
import { useMemo } from 'react';
import styled from 'styled-components';

type Props = {
  icon?: string | React.ReactNode;
  message?: string;
  status?: 'success' | 'error';
  actionName?: string;
  onAction?: () => void;
};

const Container = styled.div`
  grid-template-columns: ${({ gridTemplate }) => gridTemplate};
`;

export const CustomToastContainer: React.FC<Props> = (props) => {
  const { icon, message, status = 'success', actionName = '' } = props;
  const gridTemplate = useMemo<string>(() => {
    const templates = [];
    icon && templates.push('min-content');
    templates.push('1fr');
    actionName && templates.push('min-content');
    return templates.join(' ');
  }, []);

  const classNames = useMemo<string>(() => {
    const classes = ['mercado-toast'];
    classes.push(status);
    return classes.join(' ');
  }, [status]);

  return (
    <Container className={classNames} gridTemplate={gridTemplate}>
      {icon && <div className="icon">{typeof icon === 'string' ? <Icon name={icon} /> : icon}</div>}
      <div className="message">{typeof message === 'string' && message}</div>
      {actionName && (
        <Button textTransform="uppercase" bgColor="transparent" onClick={props.onAction}>
          {actionName}
        </Button>
      )}
    </Container>
  );
};
