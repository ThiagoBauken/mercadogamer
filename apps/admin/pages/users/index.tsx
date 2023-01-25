import { NextPage } from 'next';
import { AdminLayout } from '@admin/layout/default';
import { UsersPageContent } from '@admin/page-content/users';

const Users: NextPage = () => {
  return (
    <AdminLayout>
      <UsersPageContent />
    </AdminLayout>
  );
};

export default Users;
