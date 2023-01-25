import { AdminLayout } from '../../src/layout/default';
import { VentasPageContent } from '../../src/page-content/ventas';

const Ventas: React.FC = () => {
  return (
    <AdminLayout>
      <VentasPageContent />
    </AdminLayout>
  );
};

export default Ventas;
