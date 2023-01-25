/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { ThemeColor } from '@theme/color';
import { Icon } from '@widgets/icon';

const Container = styled.div`
  --mercado-checkbox-color: ${(props) => props.color};
  --mercado-checkbox-text-color: ${(props) => props.textColor};
`;

export const Radiobox: React.FC<RadioboxProps> = (props) => {
  const {
    checked,
    disabled,
    color = ThemeColor.primary,
    textColor = 'currentColor',
    className,
    size = 'default',
    inputRef,
    loading,
  } = props;

  const [state, setState] = useState<{ checked?: boolean; indeterminate?: boolean }>({
    checked: checked,
  });

  // ref
  const currentRef = useRef<HTMLInputElement>();

  useEffect(() => {
    setState({
      ...state,
      checked,
    });
  }, [checked]);

  const _className = useMemo<string>(() => {
    const class_name = ['mercado-radiobox'];
    disabled && class_name.push('disabled');
    size && class_name.push(size);
    (state.checked || state.indeterminate) && class_name.push('checked');
    class_name.push(className);
    return class_name.join(' ');
  }, [className, disabled, size, state.checked, state.indeterminate]);

  const onClick = (e): void => {
    currentRef?.current?.focus();
    inputRef?.current?.focus();
    e.stopPropagation();

    if (disabled) return;
    props.onChange
      ? props.onChange(!state.checked)
      : setState({ ...state, checked: !state.checked });
  };

  const renderIcon = (): React.ReactElement => {
    if (state.checked) return <Icon name="radio-on" />;

    return <Icon name="radio-off" />;
  };

  return (
    <Container className={_className} color={color} textColor={textColor} onClick={onClick}>
      <input ref={inputRef || currentRef} disabled={disabled} />
      <div className={`icon${loading ? ' loading' : ''}`}>{renderIcon()}</div>
      {props.children && <div className="label">{props.children}</div>}
    </Container>
  );
};
