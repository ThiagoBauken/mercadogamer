import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DefaultLayout } from '@layout/default-layout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getCatalogMeta } from '@web/utils/catalogMetaTags';

const CatalogContent = dynamic(() => import('@page-contents/catalogo').then(mod => mod.CatalogContent), { ssr: false });

const CatalogPage: NextPage = () => {
  const router = useRouter();
  const { title, description } = getCatalogMeta(router.query);

  return (
    <DefaultLayout>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <CatalogContent />
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

export default CatalogPage;
