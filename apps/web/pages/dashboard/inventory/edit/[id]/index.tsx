import { NextPage } from 'next';
import { DashboardLayout } from '@layout/dashboard';
import { EditProductPageContent } from '@dashboard/edit-product';

const AddProduct: NextPage = () => {
  return (
    <DashboardLayout>
      <EditProductPageContent />
    </DashboardLayout>
  );
};

export default AddProduct;
