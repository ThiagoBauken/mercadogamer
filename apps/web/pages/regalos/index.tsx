import { NextPage } from 'next';
import { DefaultLayout } from '@layout/default-layout';
import { RuletaContent } from '@page-contents/gift';
import { useRouter } from 'next/router';
import Head from 'next/head';

const RuletaPage: NextPage = () => {
  const router = useRouter();

  return (
    <DefaultLayout>
      {router.query.rb && (
        <Head>
          <title>Mercado Gamer - GANA PLATA GRATIS TODOS LOS DIAS</title>
          <meta
            name="description"
            content="¡Jugá y Gana! Sencillo, rápido y te conviene. Dinero Gratis para la compra de cualquier producto digital dentro de Mercado Gamer. Juegos, Skins, Gift Cards, Monedas, Packs y mucho más."
          />
        </Head>
      )}
      <RuletaContent />
    </DefaultLayout>
  );
};

export async function getServerSideProps(): Promise<{
  props: {
    title: string;
    description: string;
    url: string;
  };
}> {
  return {
    props: {
      title: 'Mercado Gamer - Gira la Ruleta de Regalos para premios gratis 🎁',
      description:
        'Obtén premios y descuentos TODOS LOS DÍAS para tus compras dentro de nuestro marketplace. ¡Los mejores jugadores eligen Mercado Gamer!',
      url: 'https://www.mercadogamer.com/ruleta',
    },
  };
}

export default RuletaPage;
