import { NextPage } from 'next';
import { DashboardLayout } from '@layout/dashboard';
import { ShoppingContent } from '@dashboard/shopping';

const NotFind: NextPage = () => {
  return (
    <DashboardLayout>
      <ShoppingContent />
    </DashboardLayout>
  );
};

export default NotFind;
