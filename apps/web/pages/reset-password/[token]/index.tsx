import { NextPage } from 'next';
import { DefaultLayout } from '@layout/default-layout';
import { ResetPasswordPageContent } from '@page-contents/reset-password';

const ResetPassword: NextPage = () => {
  return (
    <DefaultLayout>
      <ResetPasswordPageContent />
    </DefaultLayout>
  );
};

export default ResetPassword;
