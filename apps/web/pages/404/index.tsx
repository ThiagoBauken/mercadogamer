import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { DefaultLayout } from '@layout/default-layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const NotFindPage = dynamic(() => import('@page-contents/not-find-page').then(mod => mod.NotFindPage), { ssr: false });

const NotFind: NextPage = () => {
  return (
    <DefaultLayout>
      <NotFindPage />
    </DefaultLayout>
  );
};

export async function getStaticProps({ locale }: { locale?: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
    revalidate: 60, // ISR: Revalidar a cada 60 segundos
  };
}

export default NotFind;
