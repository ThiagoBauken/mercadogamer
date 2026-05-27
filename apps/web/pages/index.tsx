import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { DynamicLayout } from '@layout/dynamic-layout';


const HomeContent = dynamic(() => import('@page-contents/home').then(mod => mod.HomeContent), { ssr: false });

const HomePage: NextPage = () => {
  return (
    <DynamicLayout>
      <HomeContent />
    </DynamicLayout>
  );
};

export async function getStaticProps({ locale }: { locale?: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'pt-BR', ['common', 'products', 'auth'])),
      title: 'Mercado Gamer - Juegos, Skins, Códigos y más al mejor precio',
      description:
        '¡Compra juegos más baratos y sin impuesto país! Para PC, celular, PS4, PS5, Xbox, etc. Entrega al instante. ¿Qué esperas? Compra con Garantía MG',
    },
  };
}

export default HomePage;
