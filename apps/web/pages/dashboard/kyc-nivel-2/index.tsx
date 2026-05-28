// @ts-nocheck - TypeScript compatibility fix
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DashboardLayout } from '@layout/dashboard';

const KycLevel2Content = dynamic(
  () => import('@dashboard/kyc-nivel-2').then((mod) => mod.KycLevel2Content),
  { ssr: false }
);

const KycLevel2Page: NextPage = () => {
  return (
    <DashboardLayout>
      <KycLevel2Content />
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

export default KycLevel2Page;
