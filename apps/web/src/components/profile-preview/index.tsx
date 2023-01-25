import { Icon } from '@widgets/icon';

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
