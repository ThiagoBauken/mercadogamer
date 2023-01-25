import { useMemo } from 'react';

export const CheckboxIndetIcon: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '1em' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg height={_size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3ZM7.5164 11.1C7.01935 11.1 6.6164 11.5029 6.6164 12C6.6164 12.497 7.01935 12.9 7.5164 12.9H16.4835C16.9806 12.9 17.3835 12.497 17.3835 12C17.3835 11.5029 16.9806 11.1 16.4835 11.1H7.5164Z"
        fill={color}
      />
    </svg>
  );
};
