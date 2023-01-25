import { useMemo } from 'react';

export const Map: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '1em' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_8432_39272)">
        <path
          d="M14.2188 7.51562C14.2188 12.1823 8.21875 16.1823 8.21875 16.1823C8.21875 16.1823 2.21875 12.1823 2.21875 7.51562C2.21875 5.92433 2.85089 4.3982 3.97611 3.27298C5.10133 2.14777 6.62745 1.51562 8.21875 1.51562C9.81005 1.51563 11.3362 2.14777 12.4614 3.27298C13.5866 4.3982 14.2188 5.92433 14.2188 7.51562Z"
          stroke="#73778A"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.21875 9.51563C9.32332 9.51563 10.2188 8.62019 10.2188 7.51563C10.2188 6.41106 9.32332 5.51562 8.21875 5.51562C7.11418 5.51562 6.21875 6.41106 6.21875 7.51563C6.21875 8.62019 7.11418 9.51563 8.21875 9.51563Z"
          stroke="#73778A"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_8432_39272">
          <rect width="16" height="16" fill="white" transform="translate(0.21875 0.847656)" />
        </clipPath>
      </defs>
    </svg>
  );
};
