import React from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

const CheckoutHeader: React.FC = () => {
  const router = useRouter();
  return (
    <header className="mercado-checkout-layout-header">
      <div className="logo" onClick={() => router.push('/')}>
        <Icon name="logo" />
      </div>
      <div className="secure-purchase">
        <Icon name="lock" size={24} />
        Compra segura
      </div>
    </header>
  );
};

export { CheckoutHeader };
