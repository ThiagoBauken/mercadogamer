import { AdminLayout } from '../../../src/layout/default';
import { LoadsExpandedView } from '../../../src/page-content/loads/loads-detail';

const LoadsView: React.FC = () => {
  return (
    <AdminLayout>
      <LoadsExpandedView />
    </AdminLayout>
  );
};

export default LoadsView;
