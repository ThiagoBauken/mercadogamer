/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useMenuPosition } from '@hooks';
import { ThemeColor } from '@theme/color';
import { Checkbox } from '@widgets/checkbox';
import { Icon } from '@widgets/icon';

const Container = styled.div.attrs((props) => ({
  style: {
    minWidth: props.styles.width ? `${props.styles.width}px` : 'unset',
    top: props.styles.top ? `${props.styles.top}px` : 'unset',
    bottom: props.styles.bottom ? `${props.styles.bottom}px` : 'unset',
    left: props.styles.left ? `${props.styles.left}px` : 'unset',
    right: props.styles.right ? `${props.styles.right}px` : 'unset',
  },
}))`
  --mercado-menu-border-color: ${(props) => props.borderColor};
  max-height: ${(props) =>
    typeof props.maxHeight === 'string' ? props.maxHeight : `${props.maxHeight}px`};
`;

export const Menu: React.FC<MenuProps> = (props) => {
  const {
    className,
    activator,
    multiple,
    menuItems,
    disabled,
    maxHeight = 160,
    open,
    value,
    full,
    contentClass,
    borderColor = ThemeColor.primary,
    align = 'auto',
    width = 'fit-content',
  } = props;

  // state
  const [state, setState] = useState<{
    open: boolean | undefined;
    position: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
      width?: number;
    };
  }>({
    open: false,
    position: {},
  });
  const activatorRef = useRef(null);
  const menuContentRef = useRef<HTMLElement>(null);
  const selectedItemRef = useRef<HTMLElement>(null);
  const position = useMenuPosition(activatorRef, {
    menuRef: menuContentRef,
    maxHeight: maxHeight as number,
    defaultAlign: align,
  });
  // const position = {};

  const classNames = useMemo(() => {
    const classes = ['mercado-menu'];
    className && classes.push(className);
    full && classes.push('full');
    return classes.join(' ');
  }, [full, className]);

  useEffect(() => {
    setState({
      ...state,
      open: open,
    });
  }, [open]);

  useEffect(() => {
    props.onChangeOpen && props.onChangeOpen(state.open);
    state.open && selectedItemRef?.current?.scrollIntoView();
  }, [state.open, selectedItemRef]);

  useEffect(() => {
    const handleClickOutside = (event: Event): void => {
      if (activatorRef && activatorRef.current) {
        if (activatorRef.current.contains(event.target)) {
          return;
        } else {
          setState({ ...state, open: false });
        }
      }
    };
    window.addEventListener('wheel', handleClickOutside);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('wheel', handleClickOutside);
    };
  }, [activatorRef]);

  const openMenu = (e): void => {
    e.stopPropagation();
    !disabled && setState({ ...state, open: true });
  };

  const onMenuItemClick = (item: string | MenuItemProps): void => {
    setState({ ...state, open: multiple });
    if (typeof item === 'object' && item.action) {
      item.action();
    }
    if (props.onChange) {
      if (multiple) {
        const temp_value: any[] = Array.isArray(value) ? value : [];
        const item_value: string | number | boolean = typeof item === 'string' ? item : item.value;
        const index = temp_value.findIndex((element: string | number) => element === item_value);
        if (index === -1) {
          temp_value.push(item_value);
        } else {
          temp_value.splice(index, 1);
        }
        props.onChange([...temp_value]);
      } else {
        props.onChange(typeof item === 'string' ? item : item.value);
      }
    }
  };

  const getRef = (item: string | MenuItemProps): any => {
    if (typeof item === 'object' && !Array.isArray(value)) {
      return item.value === value ? { ref: selectedItemRef } : {};
    } else {
      return item === value ? { ref: selectedItemRef } : {};
    }
  };

  const getItemValue = (item: string | MenuItemProps): any => {
    return typeof item === 'string' ? item : item.value;
  };

  const onSelectAll = (): void => {
    props.onChange &&
      props.onChange(
        Array.isArray(value) && value.length === menuItems.length
          ? []
          : menuItems.map((item) => getItemValue(item))
      );
  };

  return (
    <div className={classNames} ref={activatorRef} style={{ width }}>
      <div className="content" onClick={(e) => openMenu(e)}>
        {activator}
      </div>
      <Container
        ref={menuContentRef}
        className={`menu-container${contentClass ? ` ${contentClass}` : ''}${
          state.open ? ' open' : ''
        }`}
        styles={position}
        maxHeight={maxHeight}
        borderColor={borderColor}
      >
        {Array.isArray(menuItems) ? (
          <ul>
            {menuItems.length > 0 && multiple && (
              <li onClick={onSelectAll}>
                <div className="content">
                  <Checkbox
                    checked={Array.isArray(value) && value.length === menuItems.length}
                    indeterminate={Array.isArray(value) && !!value.length}
                    onChange={onSelectAll}
                  />
                  <div className="content">
                    {Array.isArray(value) && value.length === menuItems.length
                      ? 'Deseleccionar todos'
                      : 'Seleccionar todos'}
                  </div>
                </div>
              </li>
            )}
            {menuItems
              .filter((item) => typeof item === 'string' || !item.hide)
              .map((item, index) =>
                typeof item === 'object' && item.divition ? (
                  <li className="divition" key={index}></li>
                ) : (
                  <li key={index} onClick={() => onMenuItemClick(item)} {...getRef(item)}>
                    {props.renderItem ? (
                      props.renderItem(item)
                    ) : (
                      <div
                        className="content"
                        style={{
                          color:
                            typeof item === 'string'
                              ? 'currentColor'
                              : item.color || 'currentcolor',
                        }}
                      >
                        {multiple && (
                          <Checkbox
                            checked={Array.isArray(value) && value.includes(getItemValue(item))}
                            onChange={() => onMenuItemClick(item)}
                          />
                        )}
                        {typeof item === 'string' ? (
                          item
                        ) : (
                          <React.Fragment>
                            {item.icon && (
                              <div className="icon">
                                {typeof item.icon === 'string' ? (
                                  <Icon name={item.icon} />
                                ) : (
                                  item.icon
                                )}
                              </div>
                            )}
                            <div className="content">
                              {typeof item === 'string' ? item : item.label}
                            </div>
                          </React.Fragment>
                        )}
                      </div>
                    )}
                  </li>
                )
              )}
          </ul>
        ) : (
          props.children
        )}
      </Container>
    </div>
  );
};
