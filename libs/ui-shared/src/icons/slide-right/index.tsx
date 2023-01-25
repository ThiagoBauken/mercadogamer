import { useMemo } from 'react';

export const SlideRightIcon: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '1em' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg height={_size} viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.17969 10.9009L6.17969 5.90088L1.17969 0.900879"
        stroke="#4B4E5B"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
