/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { ThemeColor } from '@theme/color';
import { Icon } from '@widgets/icon';

const Container = styled.div`
  --mercado-checkbox-color: ${(props) => props.color};
  --mercado-checkbox-text-color: ${(props) => props.textColor};
`;

export const Checkbox: React.FC<CheckboxProps> = (props) => {
  const {
    checked,
    indeterminate,
    disabled,
    color = ThemeColor.primary,
    textColor = 'currentColor',
    className,
    size = 'default',
    inputRef,
    loading,
    stopPropagation = true,
  } = props;

  const [state, setState] = useState<{ checked?: boolean; indeterminate?: boolean }>({
    checked: checked,
    indeterminate: indeterminate,
  });

  // ref
  const currentRef = useRef<HTMLInputElement>();

  useEffect(() => {
    setState({
      ...state,
      checked,
      indeterminate,
    });
  }, [checked, indeterminate]);

  const _className = useMemo<string>(() => {
    const class_name = ['mercado-checkbox'];
    disabled && class_name.push('disabled');
    size && class_name.push(size);
    (state.checked || state.indeterminate) && class_name.push('checked');
    class_name.push(className);
    return class_name.join(' ');
  }, [className, disabled, size, state.checked, state.indeterminate]);

  const onClick = (e): void => {
    currentRef?.current?.focus();
    inputRef?.current?.focus();
    stopPropagation && e.stopPropagation();

    if (disabled) return;
    props.onChange
      ? props.onChange(!state.checked)
      : setState({ ...state, checked: !state.checked });
  };

  const renderIcon = (): React.ReactElement => {
    if (state.checked) return <Icon name="checkbox-on" />;
    if (state.indeterminate) return <Icon name="checkbox-indet" />;

    return <Icon name="checkbox-off" />;
  };

  return (
    <Container className={_className} color={color} textColor={textColor} onClick={onClick}>
      <input ref={inputRef || currentRef} disabled={disabled} />
      <div className={`icon${loading ? ' loading' : ''}`}>{renderIcon()}</div>
      {props.children && <div className="label">{props.children}</div>}
    </Container>
  );
};
