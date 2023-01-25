import { useEffect, useState } from 'react';
import { addCart, openLoginModal, useAppDispatch, useTypedSelector } from '@store';
import { useRouter } from 'next/router';
import { Loading } from '@widgets/loading';
import { ProfileUserAvatar } from '@components/profile-avatar';
import {
  addMessageToToast,
  endpoints,
  get,
  getFileFullUrl,
  madeBackgroundImageUrl,
  RankingLevel,
} from '@utils';
import { Rating } from '@widgets/rating';
import { Button } from '@widgets/button';
import { ThemeColor } from '@theme/color';
import { ActionMenuItem } from '@ui-shared/components/action-menu-item';
import { UserReview } from './widgets';
import { Icon } from '@widgets/icon';
import moment from 'moment';
import { BreakPoints } from '@theme/breakpoints';
import { useWindowSize } from '@hooks';
import dynamic from 'next/dynamic';

const ProductCard = dynamic(() => import('../../components/product-card/index'));
export const ProfileContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { width } = useWindowSize();

  const {
    auth: { user },
    country: { countries },
  } = useTypedSelector((store) => store);

  const [loading, setLoading] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [showReviewAll, setShowReviewAll] = useState<boolean>(false);

  const [state, setState] = useState<{
    reviewFileter: string;
    rankingLevel: ReturnType<typeof RankingLevel>;
  }>({ reviewFileter: 'recent', rankingLevel: { icon: '', label: '', level: 'bronze' } });
  // const dispatch = useAppDispatch();
  const router = useRouter();

  const { id } = router.query;
  const [profile, setProfile] = useState<UserProfileResponse>({
    categories: [],
    orders: [],
    products: [],
    productsPages: 0,
    sellerReviews: [],
    user: null,
    userReviews: [],
    finishedSales: 0,
  });

  useEffect(() => {
    if (id) {
      loadProfile();
    }
  }, [id]);

  const loadProfile = async (): Promise<void> => {
    setLoading(true);
    try {
      const profileResponse = await get(`${endpoints.userUrl}/profile/${id}/`, {
        _filters: {},
        _sort: {},
        _populates: ['platform'],
      });

      setProfile({
        ...profileResponse.data,
      });
      setState({
        ...state,
        rankingLevel: RankingLevel(profileResponse.data?.sellerReviews?.length),
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onAddCart = async (id: any): Promise<void> => {
    if (!user?.id) {
      dispatch(openLoginModal());
    } else {
      try {
        await addCart(id);
      } catch (error) {
        const error_message = error.response.data.message;
        addMessageToToast(error_message, {
          icon: 'alert-triangle',
          status: 'error',
          actionName: 'VER CARRITO',
          onAction: () => router.push('/cart'),
        });
      }
    }
  };

  const getUserAge = (user: UserModelType): string => {
    const getCorrectStr = (
      value: number,
      condition: boolean,
      strIfSingle: string,
      strIfMultiple: string
    ): string => {
      let ret = '';
      if (condition) ret += ', ';

      ret += value + ' ';
      ret += value === 1 ? strIfSingle : strIfMultiple;
      return ret;
    };

    const created = moment(user?.createdAt);
    const today = moment(new Date());
    const diff = moment.duration(today.diff(created));

    const years = Math.floor(diff.asYears());
    const months = Math.floor(diff.asMonths()) - years * 12;
    const weeks = Math.floor(diff.asWeeks() - diff.asMonths() * (4 + 1 / 3));

    let ret = '';

    if (years > 0) {
      ret += years;
      ret += years === 1 ? ' año' : ' años';
    }

    if (months > 0) ret += getCorrectStr(months, years > 0, 'mes', 'meses');

    if (weeks > 0) ret += getCorrectStr(weeks, years > 0 || months > 0, 'semana', 'semanas');

    return ret;
  };

  // const init = async (): Promise<void> => {
  //   try {
  //     // const result = httpGetAll()
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  return (
    <section className="public-profile-page-content">
      <Loading loading={loading} />
      {profile.user?.bannerDesktop || profile.user?.bannerMobile ? (
        <div
          className="profile-header"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(17, 18, 23, 0.4) 0%, #111217 100%), url('${getFileFullUrl(
              profile.user?.bannerDesktop
            )}')`,
          }}
        ></div>
      ) : (
        <div className="mobile-banner"></div>
      )}

      <div className="user-preview">
        <ProfileUserAvatar user={profile.user} />
        {width > BreakPoints.lg ? (
          <ul className="preview-card">
            <li>
              <div
                className="icon"
                style={{ backgroundImage: madeBackgroundImageUrl(state.rankingLevel.icon) }}
              ></div>
              <div className="message">
                <div className="level">{`Nivel ${state.rankingLevel.label}`}</div>
                <div className="sells">{`${profile.finishedSales} ventas`}</div>
              </div>
            </li>
          </ul>
        ) : (
          <ul className="preview-card">
            <li>
              <div
                className="icon"
                style={{ backgroundImage: madeBackgroundImageUrl(state.rankingLevel.icon) }}
              ></div>
              <div className="message">
                <div className="level">{`Nivel ${state.rankingLevel.label}`}</div>
                <div className="sells">{`${profile.finishedSales} ventas`}</div>
              </div>
            </li>
          </ul>
        )}
      </div>
      <div className="content">
        <div className="products card">
          <div className="title">Productos destacados</div>
          <div className="content">
            <div className="products">
              {Array.isArray(profile?.products) &&
                profile.products
                  .slice(showAll ? 0 : -6)
                  .map((product) => (
                    <ProductCard
                      product={product}
                      key={product.id}
                      href={`/product-detail/${product.id}`}
                      onClick={() => onAddCart(product.id)}
                    />
                  ))}
            </div>

            {!showAll && profile.products.length > 6 && (
              <Button
                full
                bgColor={ThemeColor['gray-110']}
                color="white"
                onClick={() => setShowAll(true)}
              >
                Ver todos
              </Button>
            )}
          </div>
        </div>

        <div className="rate card">
          <div className="title">Calificaciones</div>
          <div className="content">
            <div className="rating">
              {profile?.user?.sellerQualification?.toFixed(2)}
              <Rating icon="star" activeIcon="star" rating={profile?.user?.sellerQualification} />
              <span>{`${profile?.user?.sellerTotalQualifications || 0} opiniones`}</span>
            </div>

            <ActionMenuItem
              label="Ordenar por"
              items={[
                { label: 'Más recientes', value: 'recent' },
                { label: 'Buenas', value: 'positive' },
                { label: 'Malas', value: 'negative' },
              ]}
              value={state.reviewFileter}
              onChange={(value) => setState({ ...state, reviewFileter: value })}
            ></ActionMenuItem>

            <div className="reviews">
              {Array.isArray(profile?.userReviews) &&
                profile.sellerReviews
                  .slice(showReviewAll ? 0 : -5)
                  .sort((a, b) => {
                    if (state.reviewFileter === 'recent') {
                      return a.updatedAt > b.updatedAt ? 1 : -1;
                    } else {
                      if (state.reviewFileter === 'positive')
                        return b.qualification - a.qualification;
                      else return a.qualification - b.qualification;
                    }
                  })
                  .filter((review) =>
                    state.reviewFileter === 'recent'
                      ? true
                      : state.reviewFileter === 'positive'
                      ? review.qualification >= 3
                      : review.qualification < 3
                  )
                  .map((review) => <UserReview key={review.id} review={review} />)}
            </div>

            {!showReviewAll && profile.sellerReviews.length > 5 && (
              <Button
                full
                bgColor={ThemeColor['gray-110']}
                color="white"
                onClick={() => setShowReviewAll(true)}
              >
                Ver todos
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
