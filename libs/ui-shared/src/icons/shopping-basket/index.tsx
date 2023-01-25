import { useMemo } from 'react';

export const ShoppingBasketIcon: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '1em' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg height={_size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19.4443 21.209H4.55584L1.47546 10.2994H22.5247L19.4443 21.209Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.0001 2.79099L16.4281 10.2994H7.57202L12.0001 2.79099Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.9999 17.0154C12.6964 17.0154 13.2611 16.4508 13.2611 15.7542C13.2611 15.0577 12.6964 14.493 11.9999 14.493C11.3033 14.493 10.7386 15.0577 10.7386 15.7542C10.7386 16.4508 11.3033 17.0154 11.9999 17.0154Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
