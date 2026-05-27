import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DashboardLayout } from '@layout/dashboard';



const OrderDetailPageContent = dynamic(() => import('@dashboard/order-detail').then(mod => mod.OrderDetailPageContent), {
  ssr: false,
});

const NotFind: NextPage = () => {
  return (
    <DashboardLayout>
      <OrderDetailPageContent />
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

export default NotFind;
