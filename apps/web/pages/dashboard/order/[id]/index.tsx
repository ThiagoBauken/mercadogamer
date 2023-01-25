import { NextPage } from 'next';
import { DashboardLayout } from '@layout/dashboard';
import { OrderDetailPageContent } from '@dashboard/order-detail';

const NotFind: NextPage = () => {
  return (
    <DashboardLayout>
      <OrderDetailPageContent />
    </DashboardLayout>
  );
};

export default NotFind;
