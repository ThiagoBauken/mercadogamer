import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { HomeContent } from '@page-contents/home';
export const NotFindPage: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    const location: Location = document.location;
    !/mercadogamer.com/gi.test(location.href) && router.push('/');
  }, []);
  return <HomeContent />;
};
