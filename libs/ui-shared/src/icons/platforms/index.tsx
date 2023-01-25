import { useMemo } from 'react';

export const PlatformsIcon: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '20px' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg height={_size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.38885 12.7716C7.27647 12.7716 7.00797 13.4621 6.62439 14.5745C6.24082 15.6868 4.90446 16.7402 2.9804 16.0704C0.88627 15.3414 1.41301 13.0258 1.41301 13.0258C1.41301 13.0258 2.59357 8.61987 3.24891 6.17412C3.87054 3.85414 6.4326 3.7192 6.4326 3.7192H13.5672C13.5672 3.7192 16.1292 3.85414 16.7509 6.17412C17.4062 8.61987 18.5867 13.0258 18.5867 13.0258C18.5867 13.0258 19.1135 15.3414 17.0194 16.0704C15.0953 16.7402 13.7589 15.6868 13.3754 14.5745C12.9918 13.4621 12.7233 12.7716 11.6109 12.7716H8.38885Z"
        stroke={color}
        strokeWidth="1.2"
      />
      <path
        d="M12.969 6.65979L12.9755 6.66633"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.969 9.99312L12.9755 9.99966"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.3025 8.32646L11.309 8.33299"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6357 8.32646L14.6423 8.33299"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.15161 6.78601V9.86693"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.69201 8.32648H5.61108"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
