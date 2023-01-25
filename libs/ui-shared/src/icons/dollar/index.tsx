import { useMemo } from 'react';

export const Dollar: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '1em' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_8414_38077)">
        <path
          d="M8.21745 15.513C11.8993 15.513 14.8841 12.5283 14.8841 8.84635C14.8841 5.16446 11.8993 2.17969 8.21745 2.17969C4.53555 2.17969 1.55078 5.16446 1.55078 8.84635C1.55078 12.5283 4.53555 15.513 8.21745 15.513Z"
          stroke="#73778A"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.21875 4.60938V13.0858"
          stroke="#73778A"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.1445 6.15234H7.25478C6.89713 6.15234 6.55412 6.29442 6.30122 6.54732C6.04833 6.80022 5.90625 7.14322 5.90625 7.50087C5.90625 7.85852 6.04833 8.20153 6.30122 8.45442C6.55412 8.70732 6.89713 8.8494 7.25478 8.8494H9.18125C9.5389 8.8494 9.8819 8.99148 10.1348 9.24437C10.3877 9.49727 10.5298 9.84028 10.5298 10.1979C10.5298 10.5556 10.3877 10.8986 10.1348 11.1515C9.8819 11.4044 9.5389 11.5465 9.18125 11.5465H5.90625"
          stroke="#73778A"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_8414_38077">
          <rect width="16" height="16" fill="white" transform="translate(0.21875 0.847656)" />
        </clipPath>
      </defs>
    </svg>
  );
};
