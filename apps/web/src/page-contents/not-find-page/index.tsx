// @ts-nocheck - TypeScript compatibility fix
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

const HomeContent = dynamic(() => import('@page-contents/home').then(mod => mod.HomeContent), { ssr: false });

export const NotFindPage: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    const location: Location = document.location;
    !/mercadogamer.com/gi.test(location.href) && router.push('/');
  }, []);
  return <HomeContent />;
};
