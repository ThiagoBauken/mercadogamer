import { useMemo } from 'react';

export const KnifeIcon: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '1em' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg height={_size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14.6286 15.8905C14.8786 15.6406 15.019 15.3016 15.019 14.9481C15.019 14.5946 14.8786 14.2556 14.6286 14.0057L9.99419 9.37126C9.74424 9.12132 9.40525 8.9809 9.05177 8.9809C8.69829 8.9809 8.3593 9.12132 8.10935 9.37126C7.85941 9.62121 7.71899 9.96021 7.71899 10.3137C7.71899 10.6672 7.85941 11.0062 8.10935 11.2561L12.7438 15.8905C12.9937 16.1405 13.3327 16.2809 13.6862 16.2809C14.0397 16.2809 14.3787 16.1405 14.6286 15.8905Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.0563 18.5968L8.75317 11.8999L12.0997 15.2464L5.4028 21.9433L2.0563 18.5968Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.7182 3.9479L10.6664 9.99978L14 13.3334L16.1156 11.2178L20.0519 7.28155C22.0008 5.33265 22.394 2.81955 22.347 1.80662L16.7182 3.9479Z"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M8.1106 15.8894L8.11844 15.8972"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.93066 18.0692L5.93851 18.077"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
