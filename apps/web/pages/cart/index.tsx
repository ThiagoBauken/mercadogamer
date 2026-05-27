import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DefaultLayout } from '@layout/default-layout';



const CartPageContent = dynamic(() => import('@page-contents/cart').then(mod => mod.CartPageContent), { ssr: false });

const CartPage: NextPage = () => {
  return (
    <DefaultLayout authorise>
      <CartPageContent />
    </DefaultLayout>
  );
};

export async function getStaticProps({ locale }: { locale?: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'pt-BR', ['common', 'dashboard'])),
    },
    revalidate: 60, // ISR: Revalidate every 60 seconds
  };
}

export default CartPage;
