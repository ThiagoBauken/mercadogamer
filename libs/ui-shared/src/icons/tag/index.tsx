import { useMemo } from 'react';

export const TagIcon: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '48px' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg height={_size} viewBox="0 0 49 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M41.1878 26.82L26.8478 41.16C26.4763 41.5319 26.0352 41.8269 25.5496 42.0282C25.064 42.2295 24.5435 42.3331 24.0178 42.3331C23.4922 42.3331 22.9716 42.2295 22.4861 42.0282C22.0005 41.8269 21.5593 41.5319 21.1878 41.16L4.00781 24V4H24.0078L41.1878 21.18C41.9328 21.9295 42.351 22.9433 42.351 24C42.351 25.0567 41.9328 26.0705 41.1878 26.82V26.82Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.0078 14H14.0278"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
