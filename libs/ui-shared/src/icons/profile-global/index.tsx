import { useMemo } from 'react';

export const ProfileGlobalIcon: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '24px' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg height={_size} viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.5312 22.0234C18.0541 22.0234 22.5312 17.5463 22.5312 12.0234C22.5312 6.50059 18.0541 2.02344 12.5312 2.02344C7.0084 2.02344 2.53125 6.50059 2.53125 12.0234C2.53125 17.5463 7.0084 22.0234 12.5312 22.0234Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.53125 12.0234H22.5312"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5312 2.02344C15.0325 4.76179 16.454 8.31547 16.5312 12.0234C16.454 15.7314 15.0325 19.2851 12.5312 22.0234C10.03 19.2851 8.6085 15.7314 8.53125 12.0234C8.6085 8.31547 10.03 4.76179 12.5312 2.02344V2.02344Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
