import { NextPage } from 'next';
import { DefaultLayout } from '@layout/default-layout';
import { ProfileContent } from '@page-contents/profile';

const ProductDetail: NextPage = () => {
  return (
    <DefaultLayout>
      <ProfileContent />
    </DefaultLayout>
  );
};

export default ProductDetail;
