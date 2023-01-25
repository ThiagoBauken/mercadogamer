import { Icon } from '@widgets/icon';
import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

const config = { attributes: true, childList: true, subtree: true };

const StyledBody = styled.div`
  border-bottom-left-radius: ${(props) => props.borderRadius}px;
  border-bottom-right-radius: ${(props) => props.borderRadius}px;
  max-height: ${(props) =>
    typeof props.maxHeight === 'string' ? props.maxHeight : `${props.maxHeight}px`};
  margin-top: ${(props) => (typeof props.space === 'string' ? props.space : `${props.space}px`)};
`;

export const Expansion: React.FC<ExpansionProps> = (props) => {
  const { collapse = false, defaultCollapse = true, hideOnDesktop = false, contentClass } = props;
  const [_collapse, setCollapse] = useState<boolean>(defaultCollapse);

  const [maxHeight, setMaxHegith] = useState<string | number>('max-content');

  const containerRef = useRef<HTMLDivElement>();
  const [observer, setObserver] = useState(null);

  const caculationMaxHeight = (): void => {
    const newHeight = containerRef.current?.scrollHeight;
    maxHeight !== newHeight && setMaxHegith(newHeight);
  };
  useEffect(() => {
    setCollapse(defaultCollapse);
  }, []);

  useEffect(() => {
    const _props = { ...props };
    _props.hasOwnProperty('collapse') && setCollapse(collapse);
  }, [collapse]);

  useEffect(() => {
    const obs = new MutationObserver(caculationMaxHeight);
    obs.observe(containerRef.current, config);
    setObserver(obs);
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [containerRef.current]);

  useEffect(() => {
    caculationMaxHeight();
  }, [containerRef, _collapse]);

  const classNames = useMemo(() => {
    const classes = ['mercado-expansion'];
    _collapse && classes.push('collapsed');
    hideOnDesktop && classes.push('hide-on-desktop');
    return classes.join(' ');
  }, [_collapse]);

  const onChangeStatus = () => {
    props.onChangeStatus ? props.onChangeStatus(!_collapse) : setCollapse(!_collapse);
  };

  return (
    <div className={classNames}>
      <div className="header" onClick={onChangeStatus}>
        <div className="title">{props.header}</div>
        <div className="icon">
          <Icon name={_collapse ? 'chevron-down' : 'chevron-up'} />
        </div>
      </div>
      <StyledBody className="content" ref={containerRef} maxHeight={maxHeight}>
        <div className={`expantion-content${contentClass ? ` ${contentClass}` : ''}`}>
          {props.children}
        </div>
      </StyledBody>
    </div>
  );
};
