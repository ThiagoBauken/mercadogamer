import { useMemo } from 'react';

export const ExclamationMarkCircle: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '1em' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg height={_size}  viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_472_2903)">
        <path d="M9 16.4997C13.1421 16.4997 16.5 13.1418 16.5 8.99966C16.5 4.85753 13.1421 1.49966 9 1.49966C4.85786 1.49966 1.5 4.85753 1.5 8.99966C1.5 13.1418 4.85786 16.4997 9 16.4997Z" stroke="#4B4E5B" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 11.9997V8.99966" stroke="#4B4E5B" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 5.99966H9.0075" stroke="#4B4E5B" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    </svg>
  );
};
