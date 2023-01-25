import { useMemo } from 'react';

export const DollarCircleIcon: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '24px' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg height={_size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.99999 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 9.99999C18.3333 5.39762 14.6024 1.66666 9.99999 1.66666C5.39762 1.66666 1.66666 5.39762 1.66666 9.99999C1.66666 14.6024 5.39762 18.3333 9.99999 18.3333Z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.99997 4.70221V15.2978"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.408 6.62869H8.79589C8.34882 6.62869 7.92007 6.80629 7.60395 7.12241C7.28783 7.43853 7.11023 7.86729 7.11023 8.31435C7.11023 8.76142 7.28783 9.19017 7.60395 9.50629C7.92007 9.82242 8.34882 10 8.79589 10H11.204C11.651 10 12.0798 10.1776 12.3959 10.4937C12.712 10.8099 12.8896 11.2386 12.8896 11.6857C12.8896 12.1327 12.712 12.5615 12.3959 12.8776C12.0798 13.1937 11.651 13.3713 11.204 13.3713H7.11023"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
