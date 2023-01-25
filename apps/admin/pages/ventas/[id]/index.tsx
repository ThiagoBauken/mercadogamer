import { AdminLayout } from '../../../src/layout/default';
import { OrderExpandedView } from '../../../src/page-content/ventas/order-detail';

const Ventas: React.FC = () => {
  return (
    <AdminLayout>
      <OrderExpandedView />
    </AdminLayout>
  );
};

export default Ventas;
