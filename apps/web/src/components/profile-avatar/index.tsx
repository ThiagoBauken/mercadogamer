import { getFileFullUrl, madeBackgroundImageUrl } from '@utils';
import { Rating } from '@widgets/rating';

type Props = {
  user: UserModelType;
};

export const ProfileUserAvatar: React.FC<Props> = ({ user }) => {
  return (
    <div className="avatar-card">
      <div className="avatar">
        <div
          className="user-photo"
          style={{
            backgroundImage: madeBackgroundImageUrl(
              getFileFullUrl(user?.picture),
              '/assets/imgs/avatar.webp'
            ),
          }}
        ></div>
      </div>
      <div className="name-space">
        <div className="name">{`${user?.username}`}</div>
        <div className="rate">
          <Rating icon="star" activeIcon="star" iconSize={16} rating={user?.sellerQualification} />
          <span>{user?.sellerQualification?.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
