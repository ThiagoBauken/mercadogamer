import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DefaultLayout } from '@layout/default-layout';



const TermConditionPageContent = dynamic(() => import('@page-contents/term-condition').then(mod => mod.TermConditionPageContent), { ssr: false });

const RuletaPage: NextPage = () => {
  return (
    <DefaultLayout>
      <TermConditionPageContent />
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

export default RuletaPage;
