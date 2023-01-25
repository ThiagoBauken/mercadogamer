import { NextPage } from 'next';
import { DashboardLayout } from '@layout/dashboard';
import { StorePageContent } from '@dashboard/store';

const Inventory: NextPage = () => {
  return (
    <DashboardLayout>
      <StorePageContent />
    </DashboardLayout>
  );
};

export default Inventory;
