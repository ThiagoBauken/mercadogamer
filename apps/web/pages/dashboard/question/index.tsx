import { NextPage } from 'next';
import { DashboardLayout } from '@layout/dashboard';
import { QuestionPageContent } from '@dashboard/question';

const Inventory: NextPage = () => {
  return (
    <DashboardLayout>
      <QuestionPageContent />
    </DashboardLayout>
  );
};

export default Inventory;
