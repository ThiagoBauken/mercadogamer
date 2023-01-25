import { useMemo } from 'react';

export const CheckboxOnIcon: React.FC<IconProps> = (props) => {
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
        d="M5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3ZM18.6669 8.73183C19.0184 8.38036 19.0184 7.81051 18.6669 7.45904C18.3154 7.10757 17.7456 7.10757 17.3941 7.45904L10.2214 14.6318L7.30812 11.7186C6.95665 11.3671 6.3868 11.3671 6.03533 11.7186C5.68386 12.0701 5.68386 12.6399 6.03533 12.9914L9.58496 16.541C9.93643 16.8925 10.5063 16.8925 10.8577 16.541L18.6669 8.73183Z"
        fill={color}
      />
    </svg>
  );
};
