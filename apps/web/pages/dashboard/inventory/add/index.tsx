import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { DashboardLayout } from '@layout/dashboard';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';


const AddProductContent = dynamic(() => import('@dashboard/add-product').then(mod => mod.AddProductContent), {
  ssr: false,
});

const AddProduct: NextPage = () => {
  return (
    <DashboardLayout>
      <AddProductContent />
    </DashboardLayout>
  );
};

export async function getStaticProps({ locale }: { locale?: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'pt-BR', ['common', 'dashboard'])),
    },
    revalidate: 60, // ISR: Revalidar a cada 60 segundos
  };
}

export default AddProduct;
