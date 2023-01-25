import { useMemo } from 'react';

export const Documents: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '1em' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_8414_38066)">
        <path
          d="M9.55339 2.17969H4.22005C3.86643 2.17969 3.52729 2.32016 3.27724 2.57021C3.02719 2.82026 2.88672 3.1594 2.88672 3.51302V14.1797C2.88672 14.5333 3.02719 14.8724 3.27724 15.1225C3.52729 15.3725 3.86643 15.513 4.22005 15.513H12.2201C12.5737 15.513 12.9128 15.3725 13.1629 15.1225C13.4129 14.8724 13.5534 14.5333 13.5534 14.1797V6.17969L9.55339 2.17969Z"
          stroke="#73778A"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.55078 2.17969V6.17969H13.5508"
          stroke="#73778A"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.8841 9.51562H5.55078"
          stroke="#73778A"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.8841 12.1797H5.55078"
          stroke="#73778A"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.88411 6.84766H6.21745H5.55078"
          stroke="#73778A"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_8414_38066">
          <rect width="16" height="16" fill="white" transform="translate(0.21875 0.847656)" />
        </clipPath>
      </defs>
    </svg>
  );
};
