import { useMemo } from 'react';

export const MoreDetailIcon: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '1em' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg height={_size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 16.8652C13.1421 16.8652 16.5 13.5074 16.5 9.36523C16.5 5.2231 13.1421 1.86523 9 1.86523C4.85786 1.86523 1.5 5.2231 1.5 9.36523C1.5 13.5074 4.85786 16.8652 9 16.8652Z"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 6.36523V12.3652"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 9.36523H12"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
