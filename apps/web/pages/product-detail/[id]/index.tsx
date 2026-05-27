import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DefaultLayout } from '@layout/default-layout';




const ProductDetailProvider = dynamic(() => import('@page-contents/product-detail/context').then(mod => mod.ProductDetailProvider), { ssr: false });

const ProductDetailContent = dynamic(() => import('@page-contents/product-detail').then(mod => mod.ProductDetailContent), { ssr: false });

const ProductDetail: NextPage = () => {
  return (
    <DefaultLayout>
      <ProductDetailProvider>
        <ProductDetailContent />
      </ProductDetailProvider>
    </DefaultLayout>
  );
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // Generate pages on-demand
  };
}

export async function getStaticProps({ locale }: { locale?: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 60, // ISR: Revalidar a cada 60 segundos
  };
}

export default ProductDetail;
