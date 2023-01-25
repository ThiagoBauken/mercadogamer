import { NextPage } from 'next';
import { DefaultLayout } from '@layout/default-layout';
import { CartPageContent } from '@page-contents/cart';

const NotFind: NextPage = () => {
  return (
    <DefaultLayout authorise>
      <CartPageContent />
    </DefaultLayout>
  );
};

export default NotFind;
