import { NextPage } from 'next';
import { DefaultLayout } from '@layout/default-layout';
import { NotFindPage } from '@page-contents/not-find-page';

const NotFind: NextPage = () => {
  return (
    <DefaultLayout>
      <NotFindPage />
    </DefaultLayout>
  );
};

export default NotFind;
