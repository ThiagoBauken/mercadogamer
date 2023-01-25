import { useMemo } from 'react';

export const PaperclipIcon: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '1em' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg height={_size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21.44 11.05L12.25 20.24C11.1242 21.3659 9.59723 21.9983 8.00505 21.9983C6.41286 21.9983 4.88589 21.3659 3.76005 20.24C2.6342 19.1142 2.00171 17.5872 2.00171 15.995C2.00171 14.4028 2.6342 12.8759 3.76005 11.75L12.95 2.56001C13.7006 1.80945 14.7186 1.38779 15.78 1.38779C16.8415 1.38779 17.8595 1.80945 18.61 2.56001C19.3606 3.31057 19.7823 4.32855 19.7823 5.39001C19.7823 6.45147 19.3606 7.46945 18.61 8.22001L9.41005 17.41C9.03476 17.7853 8.52577 17.9961 7.99505 17.9961C7.46432 17.9961 6.95533 17.7853 6.58005 17.41C6.20476 17.0347 5.99393 16.5257 5.99393 15.995C5.99393 15.4643 6.20476 14.9553 6.58005 14.58L15.07 6.10001"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
