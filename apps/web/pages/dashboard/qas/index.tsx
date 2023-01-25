import { NextPage } from 'next';
import { DashboardLayout } from '@layout/dashboard';
import { QAsPageContent } from '@dashboard/qas';

const Inventory: NextPage = () => {
  return (
    <DashboardLayout>
      <QAsPageContent />
    </DashboardLayout>
  );
};

export default Inventory;
