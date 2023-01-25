import { Checkbox } from '@widgets/checkbox';
import { Icon } from '@widgets/icon';
import { Menu } from '@widgets/menu';
import { WrapLabel } from '@widgets/wrap-label';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  --mercado-select-bg-color: ${({ bgColor }) => bgColor};
  width: ${({ width }) => width};
`;

export const MultipleSelect: React.FC<MultipleSelect> = (props) => {
  const {
    className,
    label,
    helper,
    error,
    disabled,
    items = [],
    value = [],
    renderLabel,
    renderItem,
    placeholder,
    bgColor = 'transparent',
    width = 370,
    miniSize,
    full,
    inputRef,
    ...restProps
  } = props;

  const [_value, setValue] = useState<string[]>([]);
  const [currentSelected, setCurrentSelected] = useState<string>('');

  useEffect(() => {
    setValue(value);
  }, [value]);

  useEffect(() => {
    props.onChange && props.onChange(_value);
  }, [JSON.stringify(_value)]);

  const classNames = useMemo<string>(() => {
    const classes = ['mercado-select'];
    disabled && classes.push('disabled');
    miniSize && classes.push('mini-size');
    error && classes.push('error');
    return classes.join(' ');
  }, [disabled]);

  const onChange = (value: any): void => {
    setValue(value);

    // props.onChange && props.onChange(value);
  };

  const selectedItemLabel = (): React.ReactNode => {
    return items.map((item) =>
      item['items']
        .filter((i) => _value.includes(i.value))
        .map((i) => i.label)
        .join(', ')
    );
  };

  const getCheckedStatus = (item: MenuItemProps) => {
    return {
      checked: item['items'].every((i) => _value.includes(i.value)),
      indeterminate: item['items'].some((i) => _value.includes(i.value)),
    };
  };

  const getAllCheckedStatus = () => {
    return _value.length === items.reduce((a, b) => a + b['items'].length, 0);
  };

  const getSubAllCheckedStatus = (item: MenuItemProps) => {
    const itemValues = item['items'].map((i) => i.value);
    return {
      checked: item['items'].length === _value.filter((v) => itemValues.includes(v)).length,
      indeterminate: _value.filter((v) => itemValues.includes(v)).length != 0,
    };
  };

  const onItemClick = (item): void => {
    setCurrentSelected(item.value);
  };

  const onSubItemClick = (item): void => {
    const newValues = _value.includes(item.value)
      ? [..._value.filter((v) => v != item.value)]
      : [..._value, item.value];

    setValue(newValues);
  };

  const onSelectAll = (): void => {
    const newValues = getAllCheckedStatus()
      ? []
      : items.reduce((arr: string[], item) => [...arr, ...item['items'].map((i) => i.value)], []);

    setValue(newValues);
    setCurrentSelected('');
  };

  const onSelectSubAll = (item: MenuItemProps): void => {
    const itemValues = item['items'].map((i) => i.value);
    const newValues = getSubAllCheckedStatus(item).checked
      ? [..._value.filter((v) => !itemValues.includes(v))]
      : [..._value, ...itemValues];

    setValue(newValues);
    setCurrentSelected('');
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
        className="multiple"
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
            {_value.length == 0 ? (
              <div className="placeholder">{placeholder}</div>
            ) : (
              <div className="label">{selectedItemLabel()}</div>
            )}

            <div className="icon">
              <Icon name="chevron-down"></Icon>
            </div>
            <input ref={inputRef} />
          </Container>
        }
        disabled={disabled}
        width={miniSize ? 'fit-content' : width}
      >
        <ul>
          {items.length > 0 && (
            <li onClick={onSelectAll}>
              <div className="content">
                <Checkbox
                  checked={getAllCheckedStatus()}
                  indeterminate={_value.length != 0}
                  onChange={onSelectAll}
                />
                <div className="content">
                  {getAllCheckedStatus() ? 'Deseleccionar todos' : 'Seleccionar todos'}
                </div>
              </div>
            </li>
          )}
          {items.map((item, index) =>
            item.divition ? (
              <li className="divition" key={index}></li>
            ) : (
              <li key={index} onClick={() => onItemClick(item)}>
                {props.renderItem ? (
                  props.renderItem(item)
                ) : (
                  <div
                    className="content"
                    style={{
                      color: item.color || 'currentColor',
                    }}
                  >
                    <Checkbox {...getCheckedStatus(item)} onChange={() => onItemClick(item)} />
                    <div className="label">{item.label}</div>
                    {currentSelected == item.value && (
                      <ul className="sub-menu">
                        {item['items'].length > 0 && (
                          <li onClick={() => onSelectSubAll(item)}>
                            <Checkbox
                              {...getSubAllCheckedStatus(item)}
                              onChange={() => onSelectSubAll(item)}
                            />
                            <div className="content">
                              {getSubAllCheckedStatus(item).checked
                                ? 'Deseleccionar todos'
                                : 'Seleccionar todos'}
                            </div>
                          </li>
                        )}
                        {item['items'].map((_item, index) =>
                          item.divition ? (
                            <li className="divition" key={index}></li>
                          ) : (
                            <li key={index} onClick={() => onSubItemClick(_item)}>
                              <Checkbox
                                checked={_value.includes(_item.value)}
                                stopPropagation={false}
                                onChange={() => onSubItemClick(_item)}
                              />
                              <div className="label">{_item.label}</div>
                            </li>
                          )
                        )}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            )
          )}
        </ul>
      </Menu>
    </WrapLabel>
  );
};
