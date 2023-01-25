import { NextPage } from 'next';
import { AdminLayout } from '@admin/layout/default';
import { EarningsPageContent } from '../../src/page-content/earnings';

const Earnings: NextPage = () => {
  return (
    <AdminLayout>
      <EarningsPageContent />
    </AdminLayout>
  );
};

export default Earnings;
