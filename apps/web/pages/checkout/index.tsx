import { NextPage } from 'next';
import { CheckoutPage } from '@page-contents/checkout';
import { CheckoutLayout } from '@layout/checkout-layout';

const NotFind: NextPage = () => {
  return (
    <CheckoutLayout authorise>
      <CheckoutPage />
    </CheckoutLayout>
  );
};

export default NotFind;
