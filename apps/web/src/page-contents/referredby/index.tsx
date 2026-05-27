import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const Loading = dynamic(() => import('@widgets/loading').then(mod => mod.Loading), { ssr: false });

export const ReferredByPage: React.FC = () => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    if (router.query?.id) {
      router.push(`/regalos?rb=${router.query?.id}`);
    }
  }, [router, router.query]);

  return (
    <>
      <Loading loading={loading} />
    </>
  );
};
