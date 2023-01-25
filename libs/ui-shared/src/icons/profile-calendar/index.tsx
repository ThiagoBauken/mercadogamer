import { useMemo } from 'react';

export const ProfileCalendarIcon: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '24px' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg height={_size} viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19.5312 4.02344H5.53125C4.42668 4.02344 3.53125 4.91887 3.53125 6.02344V20.0234C3.53125 21.128 4.42668 22.0234 5.53125 22.0234H19.5312C20.6358 22.0234 21.5312 21.128 21.5312 20.0234V6.02344C21.5312 4.91887 20.6358 4.02344 19.5312 4.02344Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5312 2.02344V6.02344"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.53125 2.02344V6.02344"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.53125 10.0234H21.5312"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
