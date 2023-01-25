import { useMemo } from 'react';

export const EntInmediataIcon: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '1em' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg height={_size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.2888 9.66L10.25 5.03467"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.346 15.6102V8.39783C22.3457 8.08164 22.2623 7.77108 22.104 7.49733C21.9458 7.22358 21.7183 6.99625 21.4445 6.83815L15.1337 3.23196C14.8595 3.0737 14.5486 2.99039 14.2321 2.99039C13.9156 2.99039 13.6047 3.0737 13.3306 3.23196L7.01971 6.83815C6.74588 6.99625 6.51843 7.22358 6.3602 7.49733C6.20196 7.77108 6.11849 8.08164 6.11816 8.39783V15.6102C6.11849 15.9264 6.20196 16.237 6.3602 16.5107C6.51843 16.7845 6.74588 17.0118 7.01971 17.1699L13.3306 20.7761C13.6047 20.9344 13.9156 21.0177 14.2321 21.0177C14.5486 21.0177 14.8595 20.9344 15.1337 20.7761L21.4445 17.1699C21.7183 17.0118 21.9458 16.7845 22.104 16.5107C22.2623 16.237 22.3457 15.9264 22.346 15.6102Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.36157 7.46024L14.2321 12.0131L22.1026 7.46024"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.2319 21.0916V12.004"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.90936 12.0131L5.84204 12.0131"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.45994 9.01306H5.84204"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.52903 15.0131H5.84204"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
