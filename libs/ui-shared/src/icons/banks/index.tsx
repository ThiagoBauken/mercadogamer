import { useMemo } from 'react';

export const Banks: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '1em' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.28125 15.0781H14.1529"
        stroke="#73778A"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.21875 8.15234V13.3544"
        stroke="#73778A"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.06641 8.15234V13.3544"
        stroke="#73778A"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.293 8.15234V13.3544"
        stroke="#73778A"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.21798 2.43359L14.0571 6.08042H2.37891L8.21798 2.43359Z"
        stroke="#73778A"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
