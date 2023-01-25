import { useMemo } from 'react';

export const ClockIcon: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '1em' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg height={_size} viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.00391 16.5C13.146 16.5 16.5039 13.1421 16.5039 9C16.5039 4.85786 13.146 1.5 9.00391 1.5C4.86177 1.5 1.50391 4.85786 1.50391 9C1.50391 13.1421 4.86177 16.5 9.00391 16.5Z"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.00391 4.5V9L12.0039 10.5"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
