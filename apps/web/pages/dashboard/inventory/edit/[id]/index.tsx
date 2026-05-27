import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DashboardLayout } from '@layout/dashboard';

const EditProductPageContent = dynamic(() => import('@dashboard/edit-product').then(mod => mod.EditProductPageContent), {
  ssr: false,
});

const AddProduct: NextPage = () => {
  return (
    <DashboardLayout>
      <EditProductPageContent />
    </DashboardLayout>
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
      ...(await serverSideTranslations(locale || 'pt-BR', ['common', 'dashboard'])),
    },
    revalidate: 60, // ISR: Revalidar a cada 60 segundos
  };
}

export default AddProduct;
