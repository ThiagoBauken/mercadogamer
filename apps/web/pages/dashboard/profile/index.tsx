import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DashboardLayout } from '@layout/dashboard';



const ProfilePageContent = dynamic(() => import('@dashboard/profile').then(mod => mod.ProfilePageContent), {
  ssr: false,
});

const Inventory: NextPage = () => {
  return (
    <DashboardLayout>
      <ProfilePageContent />
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
