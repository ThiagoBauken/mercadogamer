import { NextPage } from 'next';
import { DashboardLayout } from '@layout/dashboard';
import { SupportPageContent } from '@dashboard/support';

const Inventory: NextPage = () => {
  return (
    <DashboardLayout>
      <SupportPageContent />
    </DashboardLayout>
  );
};

export default Inventory;
