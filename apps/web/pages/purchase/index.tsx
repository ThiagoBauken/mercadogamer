import { NextPage } from 'next';
import { DefaultLayout } from '@layout/default-layout';
import { PurchaseContent } from '@page-contents/purchase';

const ProductDetail: NextPage = () => {
  return (
    <DefaultLayout>
      <PurchaseContent />
    </DefaultLayout>
  );
};

export default ProductDetail;
