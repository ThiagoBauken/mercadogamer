import { NextPage } from 'next';
import { DashboardLayout } from '@layout/dashboard';
import { BalancePageContent } from '@dashboard/balance';

const Inventory: NextPage = () => {
  return (
    <DashboardLayout>
      <BalancePageContent />
    </DashboardLayout>
  );
};

export default Inventory;
