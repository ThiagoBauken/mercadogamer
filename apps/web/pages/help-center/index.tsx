import { NextPage } from 'next';
import { DefaultLayout } from '@layout/default-layout';
import { HelpCenterPageContent } from '@page-contents/help-center';
import Head from 'next/head';

const RuletaPage: NextPage = () => {
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

export default RuletaPage;
