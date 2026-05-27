// @ts-nocheck - TypeScript compatibility fix

import dynamic from 'next/dynamic';

type Props = {
  icon: string;
  label: string;
  message: React.ReactNode;
};

const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

export const StoreInformationCard: React.FC<Props> = ({ icon, label, message }) => {
  return (
    <div className="store-information-card">
      <div className="icon">
        <Icon name={icon} />
      </div>
      <div className="content">
        <div className="title">{label}</div>
        <div className="message">{message}</div>
      </div>
    </div>
  );
};
