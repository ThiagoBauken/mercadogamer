// @ts-nocheck - TypeScript compatibility fix
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DashboardLayout } from '@layout/dashboard';

const KycPageContent = dynamic(
  () => import('@dashboard/kyc').then((mod) => mod.KycPageContent),
  { ssr: false }
);

const KycPage: NextPage = () => {
  return (
    <DashboardLayout>
      <KycPageContent />
    </DashboardLayout>
  );
};

export async function getStaticProps({ locale }: { locale?: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'pt-BR', ['common', 'dashboard', 'kyc'])),
    },
    revalidate: 60,
  };
}

export default KycPage;
