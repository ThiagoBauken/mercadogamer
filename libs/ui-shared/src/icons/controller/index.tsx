import { useMemo } from 'react';

export const ControllerIcon: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '1em' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg height={_size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.0668 15.3264C8.73196 15.3264 8.40976 16.1549 7.94947 17.4898C7.48917 18.8246 5.88555 20.0887 3.57668 19.2849C1.06372 18.4101 1.6958 15.6314 1.6958 15.6314C1.6958 15.6314 3.11248 10.3443 3.89888 7.40937C4.64484 4.6254 7.71932 4.46347 7.71932 4.46347H16.2808C16.2808 4.46347 19.3553 4.6254 20.1012 7.40937C20.8876 10.3443 22.3043 15.6314 22.3043 15.6314C22.3043 15.6314 22.9364 18.4101 20.4234 19.2849C18.1145 20.0887 16.5109 18.8246 16.0506 17.4898C15.5903 16.1549 15.2681 15.3264 13.9333 15.3264H10.0668Z"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M15.563 7.99219L15.5708 8.00003"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.563 11.9922L15.5708 12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.563 9.99219L13.5708 10"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.563 9.99219L17.5708 10"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.58203 8.14365V11.8408"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.4305 9.99222H6.7334"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
