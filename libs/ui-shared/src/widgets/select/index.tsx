import { Icon } from '@widgets/icon';
import { Menu } from '@widgets/menu';
import { WrapLabel } from '@widgets/wrap-label';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  --mercado-select-bg-color: ${({ bgColor }) => bgColor};
  width: ${({ width }) => width};
`;
export const Select: React.FC<SelectProps> = (props) => {
  const {
    className,
    label,
    helper,
    error,
    disabled,
    items = [],
    value,
    renderLabel,
    renderItem,
    placeholder,
    bgColor = 'transparent',
    width = 370,
    miniSize,
    inputRef,
    full,
    suggestion,
    ...restProps
  } = props;

  const [_value, setValue] = useState<any>('');

  const [_suggestion, setSuggestion] = useState<string>('');

  useEffect(() => {
    setValue(value);
    const selectedItem = items.find((item) =>
      typeof item === 'string' ? item === value : item.value === value
    );

    if (selectedItem)
      setSuggestion(typeof selectedItem === 'string' ? selectedItem : `${selectedItem?.label}`);
    else setSuggestion('');
  }, [value]);

  const classNames = useMemo<string>(() => {
    const classes = ['mercado-select'];
    disabled && classes.push('disabled');
    miniSize && classes.push('mini-size');
    error && classes.push('error');
    return classes.join(' ');
  }, [disabled]);

  const onChange = (value: any): void => {
    setValue(value);
    const selectedItem = items.find((item) =>
      typeof item === 'string' ? item === value : item.value === value
    );

    setSuggestion(typeof selectedItem === 'string' ? selectedItem : `${selectedItem?.label}`);
    props.onChange && props.onChange(value);
  };

  const selectedItem = (): string | MenuItemProps => {
    return items.find((item: string | MenuItemProps) =>
      typeof item === 'object' ? item.value === _value : item
    );
  };

  const selectedItemLabel = (): React.ReactNode => {
    const item = selectedItem();
    if (restProps.multiple) {
      return _value
        ?.map((value) =>
          items.find((item) => (typeof item === 'object' ? item.value === value : item === value))
        )
        .map((item) => (typeof item === 'object' ? item.label : item))
        .join(', ');
    } else return typeof item === 'object' ? item.label : item;
  };

  const getItemLabel = (item: string | MenuItemProps): string => {
    return typeof item === 'object' ? `${item.label}` : item;
  };

  const onChangeSuggestion = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSuggestion(event.target.value);
  };

  return (
    <WrapLabel
      className={className}
      label={label}
      helper={helper}
      error={error}
      width={full ? '100%' : miniSize ? 'fit-content' : width}
    >
      <Menu
        {...restProps}
        full={full}
        activator={
          <Container
            className={classNames}
            bgColor={bgColor}
            width={
              full
                ? '100%'
                : miniSize
                ? 'fit-content'
                : typeof width === 'string'
                ? width
                : `${width}px`
            }
          >
            {suggestion ? (
              <input
                ref={inputRef}
                className="suggestion"
                value={_suggestion}
                onChange={onChangeSuggestion}
                placeholder={placeholder}
              ></input>
            ) : !_value ? (
              <div className="placeholder">{placeholder}</div>
            ) : (
              <div className="label">
                {renderLabel ? renderLabel(selectedItem()) : selectedItemLabel()}
              </div>
            )}
            <div className="icon">
              <Icon name="chevron-down"></Icon>
            </div>
            {!suggestion && <input ref={inputRef} />}
          </Container>
        }
        menuItems={
          suggestion
            ? items.filter((item) => new RegExp(_suggestion, 'i').test(getItemLabel(item)))
            : items
        }
        disabled={disabled}
        value={_value}
        onChange={onChange}
        renderItem={renderItem}
        width={miniSize ? 'fit-content' : width}
      ></Menu>
    </WrapLabel>
  );
};
