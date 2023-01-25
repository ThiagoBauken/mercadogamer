import { useMemo } from 'react';

export const LoadsCalender: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '1em' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_8414_38056)">
        <path
          d="M12.8854 3.51562H3.55208C2.8157 3.51562 2.21875 4.11258 2.21875 4.84896V14.1823C2.21875 14.9187 2.8157 15.5156 3.55208 15.5156H12.8854C13.6218 15.5156 14.2188 14.9187 14.2188 14.1823V4.84896C14.2188 4.11258 13.6218 3.51562 12.8854 3.51562Z"
          stroke="#73778A"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.8867 2.17969V4.84635"
          stroke="#73778A"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.55078 2.17969V4.84635"
          stroke="#73778A"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.21875 7.51562H14.2188"
          stroke="#73778A"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_8414_38056">
          <rect width="16" height="16" fill="white" transform="translate(0.21875 0.847656)" />
        </clipPath>
      </defs>
    </svg>
  );
};
