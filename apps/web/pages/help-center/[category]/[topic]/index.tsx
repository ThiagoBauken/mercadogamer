import { NextPage } from 'next';
import { DefaultLayout } from '@layout/default-layout';
import { HelpCenterCategory } from '@page-contents/help-center-category';

const RuletaPage: NextPage = () => {
  return (
    <DefaultLayout>
      <HelpCenterCategory />
    </DefaultLayout>
  );
};

export default RuletaPage;
