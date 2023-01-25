import { useMemo } from 'react';

export const ProfileCartIcon: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '24px' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg height={_size} viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_3252_17327)">
        <path
          d="M9.53125 22.0234C10.0835 22.0234 10.5312 21.5757 10.5312 21.0234C10.5312 20.4712 10.0835 20.0234 9.53125 20.0234C8.97897 20.0234 8.53125 20.4712 8.53125 21.0234C8.53125 21.5757 8.97897 22.0234 9.53125 22.0234Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20.5312 22.0234C21.0835 22.0234 21.5312 21.5757 21.5312 21.0234C21.5312 20.4712 21.0835 20.0234 20.5312 20.0234C19.979 20.0234 19.5312 20.4712 19.5312 21.0234C19.5312 21.5757 19.979 22.0234 20.5312 22.0234Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.53125 1.02344H5.53125L8.21125 14.4134C8.30269 14.8738 8.55316 15.2874 8.9188 15.5817C9.28443 15.8761 9.74195 16.0324 10.2113 16.0234H19.9312C20.4006 16.0324 20.8581 15.8761 21.2237 15.5817C21.5893 15.2874 21.8398 14.8738 21.9312 14.4134L23.5312 6.02344H6.53125"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};
