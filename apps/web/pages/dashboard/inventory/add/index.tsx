import { NextPage } from 'next';
import { DashboardLayout } from '@layout/dashboard';
import { AddProductContent } from '@dashboard/add-product';

const AddProduct: NextPage = () => {
  return (
    <DashboardLayout>
      <AddProductContent />
    </DashboardLayout>
  );
};

export default AddProduct;
