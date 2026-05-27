import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DefaultLayout } from '@layout/default-layout';



const ProfileContent = dynamic(() => import('@page-contents/profile').then(mod => mod.ProfileContent), { ssr: false });

const ProductDetail: NextPage = () => {
  return (
    <DefaultLayout>
      <ProfileContent />
    </DefaultLayout>
  );
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // Generate pages on-demand
  };
}

export async function getStaticProps({ locale }: { locale?: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 60, // ISR: Revalidar a cada 60 segundos
  };
}

export default ProductDetail;
