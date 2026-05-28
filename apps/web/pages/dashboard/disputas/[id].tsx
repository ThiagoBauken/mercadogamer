// @ts-nocheck
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DashboardLayout } from '@layout/dashboard';

const DisputaDetalheContent = dynamic(
  () => import('@dashboard/disputas').then((mod) => mod.DisputaDetalheContent),
  { ssr: false }
);

const DisputaDetalhePage: NextPage = () => {
  return (
    <DashboardLayout>
      <DisputaDetalheContent />
    </DashboardLayout>
  );
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ locale }: { locale?: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'pt-BR', ['common', 'dashboard', 'disputes'])),
    },
    revalidate: 60,
  };
}

export default DisputaDetalhePage;
