import { useMemo } from 'react';

export const CuponIcon: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '1em' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg height={_size} viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.38281 4.35399V8.68409C3.11086 8.92071 3.74531 9.38173 4.19526 10.0011C4.6452 10.6204 4.88754 11.3663 4.88753 12.1318C4.88752 12.8974 4.64518 13.6432 4.19524 14.2626C3.7453 14.8819 3.11085 15.3429 2.38281 15.5795V19.646H21.6956V15.5795C20.9675 15.3429 20.3331 14.8819 19.8831 14.2626C19.4332 13.6432 19.1908 12.8974 19.1908 12.1318C19.1908 11.3663 19.4332 10.6204 19.8831 10.0011C20.3331 9.38173 20.9675 8.92071 21.6956 8.68409V4.35399H2.38281Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.0312 12H12.0423"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.0312 7.7916H12.0423"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.0312 16.2082H12.0423"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
