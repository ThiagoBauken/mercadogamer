import { NextPage } from 'next';
import { DashboardLayout } from '@layout/dashboard';
import { InventoryContent } from '@dashboard/inventory';

const Inventory: NextPage = () => {
  return (
    <DashboardLayout>
      <InventoryContent />
    </DashboardLayout>
  );
};

export default Inventory;
