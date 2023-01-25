import { NextPage } from 'next';
import { DashboardLayout } from '@layout/dashboard';
import { ProfilePageContent } from '@dashboard/profile';

const Inventory: NextPage = () => {
  return (
    <DashboardLayout>
      <ProfilePageContent />
    </DashboardLayout>
  );
};

export default Inventory;
