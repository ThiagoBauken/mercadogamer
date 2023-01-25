import { useCallback, useEffect } from 'react';

export const useOutsideClick = (
  ref: React.MutableRefObject<HTMLElement>,
  onClickOutside?: () => void
): void => {
  const handleClickOutside = useCallback(
    (event: Event): void => {
      if (ref && ref.current) {
        if (ref.current.contains(event.target as Node)) {
          return;
        } else {
          onClickOutside && onClickOutside();
        }
      }
    },
    [ref, onClickOutside]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
};
