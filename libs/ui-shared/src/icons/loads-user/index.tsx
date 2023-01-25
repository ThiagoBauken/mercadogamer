import { useMemo } from 'react';

export const LoadsUser: React.FC<IconProps> = (props) => {
  const { color = 'currentColor', size = '1em' } = props;
  const _size = useMemo(() => (typeof size === 'string' ? size : `${size}px`), [size]);
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.5534 14.8477V13.5143C13.5534 12.8071 13.2724 12.1288 12.7723 11.6287C12.2722 11.1286 11.594 10.8477 10.8867 10.8477H5.55339C4.84614 10.8477 4.16786 11.1286 3.66777 11.6287C3.16767 12.1288 2.88672 12.8071 2.88672 13.5143V14.8477"
        stroke="#73778A"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.21745 8.18099C9.69021 8.18099 10.8841 6.98708 10.8841 5.51432C10.8841 4.04156 9.69021 2.84766 8.21745 2.84766C6.74469 2.84766 5.55078 4.04156 5.55078 5.51432C5.55078 6.98708 6.74469 8.18099 8.21745 8.18099Z"
        stroke="#73778A"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
