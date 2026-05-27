import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DefaultLayout } from '@layout/default-layout';
import Head from 'next/head';

const HelpCenterPageContent = dynamic(() => import('@page-contents/help-center').then(mod => mod.HelpCenterPageContent), { ssr: false });

const HelpCenterPage: NextPage = () => {
  return (
    <DefaultLayout>
      <Head>
        <title>Mercado Gamer - Centro de AYUDA para TODOS los usuarios</title>
        <meta
          name="description"
          content="En nuestro centro de ayuda vas a encontrar como es el funcionamiento de la plataforma. ¡Sencillo, fácil y rápido! ¿Quieres saber cuál es la Garantía MG?"
        />
      </Head>
      <HelpCenterPageContent />
    </DefaultLayout>
  );
};

export async function getStaticProps({ locale }: { locale?: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'pt-BR', ["common"])),
    },
    revalidate: 60, // ISR: Revalidate every 60 seconds
  };
}

export default HelpCenterPage;
