import { NextPage } from 'next';
import { DefaultLayout } from '@layout/default-layout';
import { VendorLandingPage } from '@web/page-contents/vendedores';
import Head from 'next/head';

const VendorPage: NextPage = () => {
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

export default VendorPage;
