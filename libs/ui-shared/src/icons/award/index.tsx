import { useMemo } from 'react';

export const AwardIcon: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '48px' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg height={_size} viewBox="0 0 49 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M24.0078 30C31.7398 30 38.0078 23.732 38.0078 16C38.0078 8.26801 31.7398 2 24.0078 2C16.2758 2 10.0078 8.26801 10.0078 16C10.0078 23.732 16.2758 30 24.0078 30Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.4278 27.7798L14.0078 45.9998L24.0078 39.9998L34.0078 45.9998L31.5878 27.7598"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
