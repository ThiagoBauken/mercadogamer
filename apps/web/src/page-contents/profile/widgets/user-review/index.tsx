import { getFileFullUrl, madeBackgroundImageUrl } from '@utils';
import { Rating } from '@widgets/rating';

export const UserReview: React.FC<{ review: ReviewModelType }> = ({ review }) => {
  return (
    <div className="user-review">
      <div
        className="avatar"
        style={{
          backgroundImage: madeBackgroundImageUrl(
            getFileFullUrl(review?.qualifier?.picture),
            '/assets/imgs/avatar.webp'
          ),
        }}
      ></div>
      <div className="content">
        <div className="user-name">{review?.qualifier?.username}</div>
        <Rating
          icon="star"
          activeIcon="star"
          rating={review?.qualification}
          activeColor="#AAADB9"
          deactiveColor="#262831"
        />
        <div className="message" dangerouslySetInnerHTML={{ __html: review?.body }}></div>
      </div>
    </div>
  );
};
