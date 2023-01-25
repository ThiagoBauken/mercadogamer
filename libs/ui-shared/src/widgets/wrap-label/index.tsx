import { useMemo } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: ${({ width }) => width};
`;
export const WrapLabel: React.FC<WrapLabelProps> = (props) => {
  const { className = '', label, children, helper, error, width = 'fit-content' } = props;

  const classNames = useMemo<string>(() => {
    const classes = ['mercado-wrap-label'];
    className && classes.push(className);
    error && classes.push('error');
    return classes.join(' ');
  }, [error]);

  return (
    <Container className={classNames} width={typeof width === 'string' ? width : `${width}px`}>
      {label && <div className="label">{label}</div>}
      <div className="wrap-label-content">{children}</div>
      {helper && <div className="helper">{helper}</div>}
    </Container>
  );
};
