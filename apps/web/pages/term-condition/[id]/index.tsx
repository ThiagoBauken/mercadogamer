import { NextPage } from 'next';
import { DefaultLayout } from '@layout/default-layout';
import { TermConditionPageContent } from '@page-contents/term-condition';

const RuletaPage: NextPage = () => {
  return (
    <DefaultLayout>
      <TermConditionPageContent />
    </DefaultLayout>
  );
};

export default RuletaPage;
