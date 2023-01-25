import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { Icon } from '@widgets/icon';
import { WrapLabel } from '@widgets/wrap-label';

const Container = styled.div`
  grid-template-columns: ${({ template }) => template};
  --mercado-input-bg-color: ${({ bgColor }) => bgColor};
  min-width: ${({ width }) => (width === 'fit-content' ? '370px' : 'unset')};
`;

export const Input: React.FC<InputProps> = (props) => {
  const {
    className,
    value,
    label,
    helper,
    error,
    type,
    disabled,
    placeholder,
    prefix,
    prefixNode,
    endfix,
    endfixNode,
    bgColor = 'transparent',
    inputRef,
    width = 'fit-content',
    full = false,
    hideSpin,
    min
  } = props;

  const [focus, setFocus] = useState<boolean>(false);

  const [_value, setValue] = useState<string | number>('');

  const [cursor, setCursor] = useState(null);
  let ref = inputRef || useRef(null);

  useEffect(() => {
    setValue(value);
  }, [value]);

  useEffect(() => {
    if(ref && ref.current) {
      const input = ref.current;
      input.setSelectionRange(cursor, cursor);
    }
  }, [ref, cursor, value])

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    let value: number | string = event.target.value;

    if(type === 'number') {
      if(event.target.value.length === 0) {
        value = 0;
      } else {
        value = Number(value);

        if(!value) {
          return;
        }
      }
    }

    setCursor(event.target.selectionStart);
    setValue(event.target.value);

    if(props.onChange) {
      props.onChange(value)
    }
  };

  const template = useMemo(() => {
    let result = ['1fr'];
    prefix && (result = ['min-content'].concat(result));
    prefixNode && (result = ['min-content'].concat(result));
    endfix && result.push('min-content');
    endfixNode && result.push('min-content');
    type === 'number' && !hideSpin && result.push('min-content');
    return result.join(' ');
  }, [prefix, endfix, type, prefixNode, endfixNode, hideSpin]);

  const classNames = useMemo(() => {
    const classes = ['mercado-input'];
    error && classes.push('error');
    focus && classes.push('focus');
    disabled && classes.push('disabled');
    return classes.join(' ');
  }, [error, focus, disabled]);

  const onSpinClick = (delta: number): void => {
    const _value = Number(value) || 0;
    props.onChange && props.onChange(_value + delta);
  };

  const getInputType = () => {
    if(type === 'number') {
      return {
        type: 'text',
        inputMode: 'numeric'
      };
    } else {
      return {
        type: 'text'
      };
    }
  }

  return (
    <WrapLabel
      className={className}
      label={label}
      helper={helper}
      error={error}
      disabled={disabled}
      width={full ? '100%' : width}
    >
      <Container
        className={classNames}
        template={template}
        bgColor={bgColor}
        width={full ? '100%' : width}
      >
        {prefix && (
          <div
            className={`prefix${props.onPreFixClick ? ' pointer' : ''}`}
            onClick={props.onPreFixClick}
          >
            <Icon name={prefix} />
          </div>
        )}
        {prefixNode && <div className={`prefix node`}>{prefixNode}</div>}
        <input
          ref={inputRef || ref}
          value={_value ?? ''}
          type={type === 'number' ? 'text' : type}
          disabled={disabled}
          placeholder={placeholder}
          onChange={onChange}
          onKeyUp={props.onKeyup}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          min={min}
        />
        {endfix && (
          <div
            className={`endfix${props.onEndFixClick ? ' pointer' : ''}`}
            onClick={props.onEndFixClick}
          >
            <Icon name={endfix} />
          </div>
        )}
        {endfixNode && (
          <div className={`endfix node`} onClick={props.onEndFixClick}>
            {endfixNode}
          </div>
        )}
        {type === 'number' && !hideSpin && (
          <div className="spin">
            <div className="up-spin" onClick={() => onSpinClick(1)}>
              <Icon name="input-spin-up" />
            </div>
            <div className="down-spin" onClick={() => onSpinClick(-1)}>
              <Icon name="input-spin-down" />
            </div>
          </div>
        )}
      </Container>
    </WrapLabel>
  );
};
