import { useMemo } from 'react';

export const InviteGiftIcon: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '1em' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 12.8574V22.8574H4V12.8574"
        stroke="#3BD42B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 7.85742H2V12.8574H22V7.85742Z"
        stroke="#3BD42B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 22.8574V7.85742"
        stroke="#3BD42B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7.85742H7.5C6.83696 7.85742 6.20107 7.59403 5.73223 7.12519C5.26339 6.65635 5 6.02046 5 5.35742C5 4.69438 5.26339 4.0585 5.73223 3.58965C6.20107 3.12081 6.83696 2.85742 7.5 2.85742C11 2.85742 12 7.85742 12 7.85742Z"
        stroke="#3BD42B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7.85742H16.5C17.163 7.85742 17.7989 7.59403 18.2678 7.12519C18.7366 6.65635 19 6.02046 19 5.35742C19 4.69438 18.7366 4.0585 18.2678 3.58965C17.7989 3.12081 17.163 2.85742 16.5 2.85742C13 2.85742 12 7.85742 12 7.85742Z"
        stroke="#3BD42B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
