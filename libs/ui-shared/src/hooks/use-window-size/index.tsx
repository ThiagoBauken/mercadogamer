import { useState, useEffect } from 'react';

export const useWindowSize = (): {
  width: undefined | number;
  height: undefined | number;
} => {
  const [windowSize, setWindowSize] = useState<{
    width: undefined | number;
    height: undefined | number;
  }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = (): void => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setWindowSize({
        width: width,
        height: height,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};
