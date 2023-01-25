import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Loading } from '@widgets/loading';

export const ReferredByPage: React.FC = () => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    if (router.query?.id) {
      router.push(`/regalos?rb=${router.query?.id}`);
    }
  }, [router.query]);

  return (
    <>
      <Loading loading={loading} />
    </>
  );
};
