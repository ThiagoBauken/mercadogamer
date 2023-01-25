import { useMemo } from 'react';

export const CircleCloseIcon: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '1em' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg width={_size} viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.65885 15.1029C12.3408 15.1029 15.3255 12.1181 15.3255 8.4362C15.3255 4.7543 12.3408 1.76953 8.65885 1.76953C4.97696 1.76953 1.99219 4.7543 1.99219 8.4362C1.99219 12.1181 4.97696 15.1029 8.65885 15.1029Z"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6602 6.4375L6.66016 10.4375"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.66016 6.4375L10.6602 10.4375"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
