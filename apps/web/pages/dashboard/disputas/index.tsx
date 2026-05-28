// @ts-nocheck
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DashboardLayout } from '@layout/dashboard';

const DisputasListContent = dynamic(
  () => import('@dashboard/disputas').then((mod) => mod.DisputasListContent),
  { ssr: false }
);

const DisputasPage: NextPage = () => {
  return (
    <DashboardLayout>
      <DisputasListContent />
    </DashboardLayout>
  );
};

export async function getStaticProps({ locale }: { locale?: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'pt-BR', ['common', 'dashboard', 'disputes'])),
    },
    revalidate: 60,
  };
}

export default DisputasPage;
