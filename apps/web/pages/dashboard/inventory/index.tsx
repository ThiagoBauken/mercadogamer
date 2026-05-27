import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DashboardLayout } from '@layout/dashboard';



const InventoryContent = dynamic(() => import('@dashboard/inventory').then(mod => mod.InventoryContent), {
  ssr: false,
});

const Inventory: NextPage = () => {
  return (
    <DashboardLayout>
      <InventoryContent />
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

export default Inventory;
