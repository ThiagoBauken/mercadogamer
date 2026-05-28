// @ts-nocheck
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DashboardLayout } from '@layout/dashboard';

const UpgradeContent = dynamic(
  () => import('@dashboard/upgrade').then((mod) => mod.UpgradeContent),
  { ssr: false }
);

const UpgradePage: NextPage = () => {
  return (
    <DashboardLayout>
      <UpgradeContent />
    </DashboardLayout>
  );
};

export async function getStaticProps({ locale }: { locale?: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'pt-BR', ['common', 'dashboard', 'upgrade'])),
    },
    revalidate: 60,
  };
}

export default UpgradePage;
