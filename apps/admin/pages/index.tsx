import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AdminLayout } from '@admin/layout/default';

export const Index: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    router.push('/ventas');
  }, []);

  return <AdminLayout>{/* <Loading loading={true} /> */}</AdminLayout>;
};

export default Index;
