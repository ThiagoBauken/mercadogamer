import { Icon } from '@widgets/icon';
import { useMemo } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  --mercado-modal-width: ${({ width }) => width};
`;
export const Modal: React.FC<ModalProps> = (props) => {
  const { open = false, contentClass = '', header = '', width = 'fit-content', className } = props;

  const classNames = useMemo<string>(() => {
    const classes = ['mercado-modal'];
    className && classes.push(className);
    return classes.join(' ');
  }, [className]);

  return open ? (
    <Container className={classNames} width={typeof width === 'number' ? `${width}px` : width}>
      <div
        className="overlay"
        onClick={(e) => {
          e.stopPropagation();
          return;
        }}
      ></div>
      <div className="modal-content">
        <div className="header">
          <div className="title">{header}</div>
          <div className="close-icon" onClick={props.onClose}>
            <Icon name="close" />
          </div>
        </div>
        <div className={`content${contentClass ? ` ${contentClass}` : ''}`}>{props.children}</div>
      </div>
    </Container>
  ) : null;
};
