import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { CheckoutLayout } from '@layout/checkout-layout';


const CheckoutPageContent = dynamic(() => import('@page-contents/checkout').then(mod => mod.CheckoutPage), { ssr: false });

const CheckoutPage: NextPage = () => {
  return (
    <CheckoutLayout authorise>
      <CheckoutPageContent />
    </CheckoutLayout>
  );
};

export async function getStaticProps({ locale }: { locale?: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'pt-BR', ['common', 'checkout'])),
    },
    revalidate: 60, // ISR: Revalidate every 60 seconds
  };
}

export default CheckoutPage;
