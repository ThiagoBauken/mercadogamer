/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from 'react';
const config = { attributes: true, childList: true, subtree: true };

type OptionsType = {
  directory?: 'vertical' | 'horizontal';
  menuRef?: React.MutableRefObject<HTMLElement>;
  maxHeight?: number;
  defaultAlign?: 'auto' | 'left' | 'right';
};

export const useMenuPosition = (
  ref: React.MutableRefObject<HTMLElement>,
  options: OptionsType = {
    directory: 'vertical',
    maxHeight: 300,
    defaultAlign: 'auto',
  }
): MenuPositionType => {
  const [state, setState] = useState<MenuPositionType>({});

  const [time, setTime] = useState(0);

  const [observer, setObserver] = useState(null);

  const defaultOptions = useMemo<OptionsType>(
    () => ({
      directory: 'vertical',
      maxHeight: 300,
      defaultAlign: 'auto',
    }),
    []
  );

  const getMenuPosition = (): void => {
    const position: MenuPositionType = {};
    if (ref.current) {
      const currentOptions = { ...defaultOptions, ...options };
      const { top, left, bottom, width, right } = ref.current.getBoundingClientRect();
      const menuWidth = options.menuRef?.current?.offsetWidth ?? 0;
      const menuPosition =
        currentOptions.defaultAlign === 'auto'
          ? right + menuWidth > window.innerWidth
            ? 'right'
            : 'left'
          : currentOptions.defaultAlign;
      position.width = width;
      menuPosition === 'right'
        ? (position.right = window.innerWidth - right)
        : (position.left = left);
      if (window.innerHeight - bottom < options.maxHeight) {
        position.bottom = window.innerHeight - top + 1;
      } else {
        position.top = bottom + 1;
      }
    }
    setState(position);
  };

  const caculateMenuContainer = (): void => {
    setTime(Date.now());
  };

  useEffect(() => {
    document.addEventListener('scroll', caculateMenuContainer);
    window.addEventListener('resize', caculateMenuContainer);
    ref.current.addEventListener('mouseenter', caculateMenuContainer);
    ref.current.addEventListener('mouseout', caculateMenuContainer);
    return () => {
      document.removeEventListener('scroll', caculateMenuContainer);
      window.removeEventListener('resize', caculateMenuContainer);
    };
  }, [ref]);

  useEffect(() => {
    time && getMenuPosition();
  }, [time]);

  useEffect(() => {
    if (ref?.current) {
      const obs = new MutationObserver(caculateMenuContainer);
      obs.observe(ref.current, config);
      setObserver(obs);
    } else {
      getMenuPosition();
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [ref?.current]);

  return state;
};
