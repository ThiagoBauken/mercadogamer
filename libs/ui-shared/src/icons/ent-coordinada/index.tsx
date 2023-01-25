import { useMemo } from 'react';

export const EntCoordinadaIcon: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '1em' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg height={_size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.7298 8.35352L6.10303 3.91043"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.6003 10.0111V7.14935C17.6 6.84768 17.5204 6.5514 17.3694 6.29023C17.2185 6.02905 17.0015 5.81217 16.7402 5.66134L10.7194 2.22086C10.4579 2.06987 10.1612 1.99039 9.85925 1.99039C9.55729 1.99039 9.26064 2.06987 8.99913 2.22086L2.97829 5.66134C2.71703 5.81217 2.50004 6.02905 2.34907 6.29023C2.19811 6.5514 2.11847 6.84768 2.11816 7.14935V14.0303C2.11847 14.332 2.19811 14.6283 2.34907 14.8894C2.50004 15.1506 2.71703 15.3675 2.97829 15.5183L8.99913 18.9588C9.26064 19.1098 9.55729 19.1893 9.85925 19.1893C10.1612 19.1893 10.4579 19.1098 10.7194 18.9588L12.8753 17.7069"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.35034 6.25482L9.8592 10.5984L17.3681 6.25482"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.85913 19.2599V10.5898"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.4721 19.654C19.9728 19.654 21.9999 17.6269 21.9999 15.1262C21.9999 12.6256 19.9728 10.5984 17.4721 10.5984C14.9715 10.5984 12.9443 12.6256 12.9443 15.1262C12.9443 17.6269 14.9715 19.654 17.4721 19.654Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.4719 13.1857V15.1262L18.4422 16.0965"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
