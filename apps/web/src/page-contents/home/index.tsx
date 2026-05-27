// @ts-nocheck - TypeScript compatibility fix
import { useEffect, useMemo, useState } from 'react';
import {
  useAppDispatch,
  getRecommendProductsForHome,
  getFeatureProductForHome,
  getDiscountPerWeekForHome,
  getGameCategoriesForHome,
  useTypedSelector,
  getBanners,
  getCategoryForHome,
} from '@store';
import { HOME } from '@action-types';
import { getFileFullUrl } from '@utils';
import { useRouter } from 'next/router';
import { useWindowSize } from '@hooks';
import { useTranslation } from 'next-i18next';

import { BreakPoints } from '@theme/breakpoints';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';


import Image from 'next/image';
import dynamic from 'next/dynamic';
import { bannersUrl } from '@utils/endpoints';

const ShortCutMenu = dynamic(() => import('@components/shortcut-menu').then(mod => mod.ShortCutMenu), { ssr: false });
const BannerButton = dynamic(() => import('../../components/banner-button/index'), { ssr: false });
const DeviceCard = dynamic(() => import('../../components/device-card/index'), { ssr: false });
const SkindSellCard = dynamic(() => import('../../components/skin-sell/index'), { ssr: false });
const GameCard = dynamic(() => import('../../components/game-card/index'), { ssr: false });
const CategoryCard = dynamic(() => import('../../components/category-card/index'), { ssr: false });
const ProductCard = dynamic(() => import('../../components/product-card/index'), { ssr: false });


const Loading = dynamic(() => import('@widgets/loading').then(mod => mod.Loading), { ssr: false });

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

export const HomeContent: React.FC = () => {
  const { t } = useTranslation('home');
  const { home } = useTypedSelector((store) => store);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { width } = useWindowSize();

  const [activeSlide, setActiveSlide] = useState<number | undefined>(undefined);
  const [activeShortcut, setShowShortcut] = useState<boolean>(false);

  const { user } = useTypedSelector((store) => store.auth);

  useEffect(() => {
    setLoading(true);
    init();
  }, []);

  const init = async (): Promise<void> => {
    try {
      await Promise.allSettled([
        dispatch(getRecommendProductsForHome()),
        dispatch(getFeatureProductForHome()),
        dispatch(getDiscountPerWeekForHome()),
        dispatch(getGameCategoriesForHome()),
        dispatch(getBanners()),
        dispatch(getCategoryForHome()),
      ]);
    } catch (error) {
      console.error('Error loading home data:', error);
      // Show error toast or handle gracefully
    } finally {
      dispatch({ type: HOME.SET_VALUE, payload: { loading: false } });
      setLoading(false);
    }
  };

  const onClickGameCard = (name: string): void => {
    router.push('/catalogo?juego=' + name);
  };

  const onClickCategoryCard = (homeItemFilter): void => {
    const keys = Object.keys(homeItemFilter);
    const params = new URLSearchParams();

    keys.forEach((key) => {
      const arr = homeItemFilter[key];
      arr.forEach((val) => {
        params.append(key, val);
      });
    });
    router.push('/catalogo?' + params);
  };

  const getBannersImage = useMemo(() => {
    if (width < 992) {
      return home.banners.mobile;
    } else {
      return home.banners.desktop;
    }
  }, [width, home.banners.desktop, home.banners.mobile]);

  const FilterPlatform = (id: string): void => {
    router.push('/catalogo?plataforma=' + id);
  };

  const getBannersJSX = () => {
    const { width, height } = getSlideDimensions();

    if (Array.isArray(getBannersImage) && getBannersImage.length) {
      return getBannersImage.map((banner, index) => (
        <SwiperSlide key={index + 'swipe'}>
          {banner.redirectUrl ? (
            <Image
              alt="homepage banner"
              width={width}
              height={height}
              style={{ cursor: 'pointer', width: '100%', height: 'auto' }}
              key={index}
              src={getFileFullUrl(banner.picture)}
              onClick={() => {
                if (activeSlide === index) {
                  user === null ? router.push(banner.secondUrl) : router.push(banner.redirectUrl);
                }
              }}
              priority={index === 0}
            />
          ) : (
            <Image
              key={index}
              src={getFileFullUrl(banner.picture)}
              width={width}
              height={height}
              alt="homepage banner"
              style={{ width: '100%', height: 'auto' }}
              priority={index === 0}
            />
          )}
        </SwiperSlide>
      ));
    } else {
      return <></>;
    }
  };

  const getSlidesPerView = () => {
    if (width < 576) {
      return 1.25;
    } else if (width >= 576 && width < 992) {
      return 1.4;
    } else {
      return 1.8;
    }
  };

  const getSlideDimensions = (): { width: number; height: number } => {
    if (width >= 993) {
      return {
        width: 950,
        height: 400,
      };
    } else {
      return {
        width: 325,
        height: 148,
      };
    }
  };

  const arrays = [
    'Free Fire',
    'Fortnite',
    'FIFA 23',
    'League of Legends',
    'Roblox',
    'Call of Duty Mobile',
  ];

  return (
    <section className="mercado-home-page">
      <Loading loading={loading} />
      <div className="slider-space">
        {getBannersImage.length > 0 && (
          <Swiper
            className="new-slider"
            modules={[Autoplay]}
            slidesPerView={getSlidesPerView()}
            centeredSlides={true}
            loop={true}
            spaceBetween={width >= 993 ? 50 : 10}
            autoplay={{
              delay: 5000,
            }}
            initialSlide={0}
            onInit={(obj) => {
              obj.slideNext();
            }}
            slideToClickedSlide={true}
            onTransitionEnd={(event) => setActiveSlide(event.realIndex)}
          >
            {getBannersJSX()}
          </Swiper>
        )}
      </div>
      {width > BreakPoints.lg ? (
        <div className="banner-button">
          <BannerButton
            imgUrl="/assets/imgs/banners/Garantia_MG_logo_PNG_5.webp"
            text={t('features.guarantee.title')}
            border={true}
          />
          <BannerButton
            imgUrl="/assets/imgs/banners/mercadopago_1.webp"
            text={t('features.payment.title')}
            border={true}
          />
          <BannerButton
            imgUrl="/assets/imgs/banners/ent_inmediata.webp"
            text={t('features.delivery.title')}
            border={true}
          />
          <BannerButton
            imgUrl="/assets/imgs/banners/headphones_1.webp"
            text={t('features.support.title')}
            border={false}
          />
        </div>
      ) : (
        <div className="home-mobile-banner">
          <div className="mobile-banner-button">
            <BannerButton
              imgUrl="/assets/imgs/banners/Garantia_MG_logo_PNG_5.webp"
              text={t('features.guarantee.title')}
              border={true}
            />
            <BannerButton
              imgUrl="/assets/imgs/banners/mercadopago_1.webp"
              text={t('features.payment.title')}
              border={true}
            />
            <BannerButton
              imgUrl="/assets/imgs/banners/ent_inmediata.webp"
              text={t('features.delivery.title')}
              border={true}
            />
            <BannerButton
              imgUrl="/assets/imgs/banners/headphones_1.webp"
              text={t('features.support.title')}
              border={false}
            />
          </div>
        </div>
      )}

      <div className="recommended-stock-section">
        <div className="recommended">
          <div className="title">{t('sections.recommended')}</div>
          <div className="stock-item-group">
            {Array.isArray(home.recommend_products) &&
              home.recommend_products.map((product, index) => (
                <ProductCard
                  product={typeof product.product === 'object' ? product.product : {}}
                  key={index}
                  hideAction
                  href={`/product-detail/${
                    typeof product.product === 'string' ? product.product : product.product?.id
                  }`}
                />
              ))}
          </div>
        </div>
      </div>
      <div className="featured-stock-section">
        <div className="featured">
          <div className="title">{t('sections.featured')}</div>
          <div className="stock-item-group">
            {Array.isArray(home.feature_products) &&
              home.feature_products.map((product, index) => (
                <ProductCard
                  product={typeof product.product === 'object' ? product.product : {}}
                  key={index}
                  hideAction
                  href={`/product-detail/${
                    typeof product.product === 'string' ? product.product : product.product?.id
                  }`}
                />
              ))}
          </div>
        </div>
      </div>

      <div className="devices-section">
        <div className="pc-option">
          <DeviceCard
            devices={{
              img: '/assets/imgs/pc_background.webp',
              icon: '/assets/imgs/device/PS_logo.webp',
              title: 'Play Station',
              content: t('sections.playstation.title'),
              button: t('sections.playstation.button'),
            }}
            onAction={() => FilterPlatform('PLAY STATION')}
          ></DeviceCard>
        </div>
        <div className="mobile-option">
          <DeviceCard
            devices={{
              img: '/assets/imgs/mobile_background.webp',
              icon: '/assets/imgs/device/smartphone_1.webp',
              title: 'Mobile',
              content: t('sections.mobile.title'),
              button: t('sections.mobile.button'),
            }}
            onAction={() => FilterPlatform('Mobile')}
          ></DeviceCard>
        </div>
      </div>

      <div className="discount-stock-section">
        <div className="discount-week">
          <div className="title">{t('sections.weekly_deals')}</div>
          <div className="stock-item-group">
            {Array.isArray(home.discount_products) &&
              home.discount_products.map((product, index) => (
                <ProductCard
                  product={typeof product.product === 'object' ? product.product : {}}
                  key={index}
                  hideAction
                  href={`/product-detail/${
                    typeof product.product === 'string' ? product.product : product.product?.id
                  }`}
                />
              ))}
          </div>
        </div>
      </div>

      <div className="game-category-section">
        <div className="game-category">
          <div className="title">{t('sections.explore_games')}</div>
          <div className="games-item-group">
            {Array.isArray(home.game_products) &&
              arrays
                .map((item) => home.game_products.find((game) => game.name === item))
                .map((game, index) => (
                  <GameCard
                    games={{ id: game?.id }}
                    key={index}
                    onAction={() => onClickGameCard(game?.name)}
                  />
                ))}
          </div>
        </div>
      </div>

      <div className="sell-by-skins-section">
        <SkindSellCard
          fileUrl="/assets/imgs/skins/image_18.webp"
          userImg="/assets/imgs/skins/541.webp"
          axeImg="/assets/imgs/skins/Frost_Blade_Harvesting_Tool_Fortnite1.webp"
          gunImg="/assets/imgs/skins/Pistol_Weapon_Fortnite1.webp"
          weaponImg="/assets/imgs/skins/Fortnite-Weapons-PNG-Pic-Background_1.webp"
          button={t('sections.sell_now')}
          // onAction={() => router.push(`/dashboard/inventory/add`)}
          onAction={() =>
            user === null ? router.push('/vendedores') : router.push('/dashboard/inventory/add')
          }
        ></SkindSellCard>
      </div>

      <div className="category-section">
        <div className="title">{t('sections.main_categories')}</div>
        <div className="categories">
          {Array.isArray(home.products.types) &&
            home.products.types.map((category, index) => (
              <CategoryCard
                label={category.label}
                key={index}
                onClick={() => onClickCategoryCard(category.homeItemFilter)}
              />
            ))}
        </div>
      </div>

      <div className="shortcut-action">
        {activeShortcut === false ? (
          <Button className="action" onClick={() => setShowShortcut(true)}>
            <Icon name="help-circle" />
          </Button>
        ) : (
          <Button className="action" onClick={() => setShowShortcut(false)}>
            <Icon name="close" />
          </Button>
        )}
        {activeShortcut === true && (
          <div className="stortcut-content">
            <ShortCutMenu />
          </div>
        )}
      </div>
    </section>
  );
};
