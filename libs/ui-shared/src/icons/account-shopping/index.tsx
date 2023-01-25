import { useMemo } from 'react';

export const AccountShoppingIcon: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '1em' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg height={_size} viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_2201_4042)">
        <path
          d="M19.4845 21.2091H4.596L1.51562 10.2994H22.5648L19.4845 21.2091Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.0374 2.79097L16.4655 10.2994H7.60938L12.0374 2.79097Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.0386 17.0154C12.7351 17.0154 13.2998 16.4508 13.2998 15.7542C13.2998 15.0577 12.7351 14.493 12.0386 14.493C11.342 14.493 10.7773 15.0577 10.7773 15.7542C10.7773 16.4508 11.342 17.0154 12.0386 17.0154Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_2201_4042">
          <rect width="24" height="24" fill="white" transform="translate(0.0390625)" />
        </clipPath>
      </defs>
    </svg>
  );
};
