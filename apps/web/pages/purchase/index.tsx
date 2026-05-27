import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DefaultLayout } from '@layout/default-layout';



const PurchaseContent = dynamic(() => import('@page-contents/purchase').then(mod => mod.PurchaseContent), { ssr: false });

const ProductDetail: NextPage = () => {
  return (
    <DefaultLayout>
      <PurchaseContent />
    </DefaultLayout>
  );
};

export async function getStaticProps({ locale }: { locale?: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 60, // ISR: Revalidar a cada 60 segundos
  };
}

export default ProductDetail;
