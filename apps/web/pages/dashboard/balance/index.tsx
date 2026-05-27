import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DashboardLayout } from '@layout/dashboard';



const BalancePageContent = dynamic(() => import('@dashboard/balance').then(mod => mod.BalancePageContent), {
  ssr: false,
});

const Inventory: NextPage = () => {
  return (
    <DashboardLayout>
      <BalancePageContent />
    </DashboardLayout>
  );
};

export async function getServerSideProps({ locale }: { locale: string}) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'pt-BR', ['common', 'dashboard'])),
    },
  };
}

export default Inventory;
