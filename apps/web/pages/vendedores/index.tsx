import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DefaultLayout } from '@layout/default-layout';
import { VendorLandingPage } from '@web/page-contents/vendedores';
import Head from 'next/head';

const VendorsPage: NextPage = () => {
  return (
    <DefaultLayout full>
      <Head>
        <title>¿Cómo y qué se puede vender en Mercado Gamer?</title>
        <meta
          name="description"
          content="¡Vender en Mercado Gamer es Gratis, Sencillo y Rápido! Publica tus items o skins que no uses y retira plata real. ¡Cualquiera puede vender! Mira todo lo que puedes publicar."
        />
      </Head>
      <VendorLandingPage />
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

export default VendorsPage;
