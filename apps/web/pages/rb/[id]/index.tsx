import { NextPage } from 'next';
import { DefaultLayout } from '@layout/default-layout';
import { ReferredByPage } from '@page-contents/referredby';

const ReferredByDetail: NextPage = () => {
  return (
    <DefaultLayout>
      <ReferredByPage />
    </DefaultLayout>
  );
};

export async function getServerSideProps(): Promise<{
  props: {
    title: string;
    description: string;
  };
}> {
  return {
    props: {
      title: 'Mercado Gamer - GANA PLATA GRATIS TODOS LOS DIAS',
      description:
        '¡Jugá y Gana! Sencillo, rápido y te conviene. Dinero Gratis para la compra de cualquier producto digital dentro de Mercado Gamer. Juegos, Skins, Gift Cards, Monedas, Packs y mucho más.',
    },
  };
}

export default ReferredByDetail;
