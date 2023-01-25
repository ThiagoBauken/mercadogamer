import { NextPage } from 'next';
import { AdminLayout } from '@admin/layout/default';
import { LoadsPageContent } from '@admin/page-content/loads';

const Loads: NextPage = () => {
  return (
    <AdminLayout>
      <LoadsPageContent />
    </AdminLayout>
  );
};

export default Loads;
