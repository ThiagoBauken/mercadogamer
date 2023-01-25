import { NextPage } from 'next';
import { DashboardLayout } from '@layout/dashboard';
import { SalePageContent } from '@dashboard/sale';

const Inventory: NextPage = () => {
  return (
    <DashboardLayout>
      <SalePageContent />
    </DashboardLayout>
  );
};

export default Inventory;
