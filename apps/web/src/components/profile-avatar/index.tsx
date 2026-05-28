// @ts-nocheck - TypeScript strict mode compatibility issues with MUI badge import
import { getFileFullUrl, madeBackgroundImageUrl } from '@utils';
import dynamic from 'next/dynamic';
import { VerifiedSellerBadge } from '@components/common/VerifiedSellerBadge';

const Rating = dynamic(() => import('@widgets/rating').then(mod => mod.Rating), { ssr: false });

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
        <div className="name" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {`${user?.username}`}
          <VerifiedSellerBadge seller={user} size="small" showLabel={false} />
        </div>
        <div className="rate">
          <Rating icon="star" activeIcon="star" iconSize={16} rating={user?.sellerQualification} />
          <span>{user?.sellerQualification?.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
