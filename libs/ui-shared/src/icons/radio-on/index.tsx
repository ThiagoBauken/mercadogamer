import { useMemo } from 'react';

export const RadioOnIcon: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '1em' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg height={_size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12.0001" cy="11.9999" r="9.14521" stroke={color} strokeWidth="1.5" />
      <circle cx="11.9999" cy="11.9999" r="4.34375" fill={color} />
    </svg>
  );
};
