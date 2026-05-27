import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DashboardLayout } from '@layout/dashboard';

const ShoppingContent = dynamic(() => import('@dashboard/shopping').then(mod => mod.ShoppingContent), {
  ssr: false,
});

const NotFind: NextPage = () => {
  return (
    <DashboardLayout>
      <ShoppingContent />
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

export default NotFind;
