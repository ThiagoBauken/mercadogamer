import { NextPage } from 'next';
import { DefaultLayout } from '@layout/default-layout';
import { SecurityPrivacyPageContent } from '@page-contents/security-privacy';

const RuletaPage: NextPage = () => {
  return (
    <DefaultLayout>
      <SecurityPrivacyPageContent />
    </DefaultLayout>
  );
};

export default RuletaPage;
