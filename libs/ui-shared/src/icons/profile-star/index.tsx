import { useMemo } from 'react';

export const ProfileStarIcon: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '24px' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg height={_size} viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.5312 2.02344L15.6213 8.28344L22.5312 9.29344L17.5312 14.1634L18.7113 21.0434L12.5312 17.7934L6.35125 21.0434L7.53125 14.1634L2.53125 9.29344L9.44125 8.28344L12.5312 2.02344Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
