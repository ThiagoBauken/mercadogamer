import dynamic from 'next/dynamic';

const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

type Props = {
  icon?: string;
  description?: string;
};

export const ProfileUserPreview: React.FC<Props> = (props) => {
  const { icon, description } = props;
  return (
    <div className="profile-preview-card">
      <Icon name={icon} size={16.7} />
      <div className="text">{description}</div>
    </div>
  );
};
