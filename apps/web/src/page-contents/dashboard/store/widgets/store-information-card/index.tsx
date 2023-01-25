import { Icon } from '@widgets/icon';

type Props = {
  icon: string;
  label: string;
  message: React.ReactNode;
};
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
