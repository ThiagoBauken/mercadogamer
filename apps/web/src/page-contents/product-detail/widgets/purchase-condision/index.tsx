// @ts-nocheck - TypeScript compatibility fix

import dynamic from 'next/dynamic';


const Expansion = dynamic(() => import('@widgets/expansion').then(mod => mod.Expansion), { ssr: false });

export const PurchaseCondition: React.FC = () => {
  return (
    <div className="purchase-condition">
      {/* <div className="title">Condiciones para la compra</div>
      <div className="content">
        <Expansion header="Política de pagos" defaultCollapse={true} />
        <Expansion header="Política de cancelación" defaultCollapse={true} />
        <Expansion header="Política de rembolso" defaultCollapse={true} />
      </div> */}
    </div>
  );
};
