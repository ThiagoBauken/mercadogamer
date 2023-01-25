import { useMemo } from 'react';

export const FileTextIcon: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '1em' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg height={_size} viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_2183_6975)">
        <path
          d="M9.66276 1.49387H4.32943C3.97581 1.49387 3.63667 1.63434 3.38662 1.88439C3.13657 2.13444 2.99609 2.47358 2.99609 2.8272V13.4939C2.99609 13.8475 3.13657 14.1866 3.38662 14.4367C3.63667 14.6867 3.97581 14.8272 4.32943 14.8272H12.3294C12.683 14.8272 13.0222 14.6867 13.2722 14.4367C13.5223 14.1866 13.6628 13.8475 13.6628 13.4939V5.49387L9.66276 1.49387Z"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.66016 1.49387V5.49387H13.6602"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.9935 8.82718H5.66016"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.9935 11.4939H5.66016"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.99349 6.16052H6.32682H5.66016"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_2183_6975">
          <rect width="16" height="16" fill="white" transform="translate(0.328125 0.160522)" />
        </clipPath>
      </defs>
    </svg>
  );
};
