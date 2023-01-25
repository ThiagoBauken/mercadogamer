import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

type IProps = ImageProps & { onErrorImg?: string };

export const ImageWithFallback: React.FC<IProps> = ({ src, onErrorImg, ...rest }) => {
  const [_src, _setSrc] = useState(src);

  const handleError = () => {
    const val = onErrorImg || '/assets/imgs/placeholder.svg';
    _setSrc(val);
  };

  return <Image onError={handleError} {...rest} src={_src} />;
};
