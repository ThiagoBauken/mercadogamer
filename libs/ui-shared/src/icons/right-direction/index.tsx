import { useMemo } from 'react';

export const RightDirectionIcon: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '1em' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg height="16px" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.68229 15.0676C12.3642 15.0676 15.349 12.0828 15.349 8.40092C15.349 4.71902 12.3642 1.73425 8.68229 1.73425C5.00039 1.73425 2.01562 4.71902 2.01562 8.40092C2.01562 12.0828 5.00039 15.0676 8.68229 15.0676Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.67969 11.0676L11.3464 8.40092L8.67969 5.73425"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.01562 8.40088H11.349"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
