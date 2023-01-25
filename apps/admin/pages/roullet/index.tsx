import { NextPage } from 'next';
import { AdminLayout } from '@admin/layout/default';
import { RoulletPageContent } from '@admin/page-content/roullet';

const Roullet: NextPage = () => {
  return (
    <AdminLayout>
      <RoulletPageContent />
    </AdminLayout>
  );
};

export default Roullet;
