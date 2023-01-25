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
import { Loading } from '@widgets/loading';
import { BreakPoints } from '@theme/breakpoints';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay } from 'swiper';
import { Button } from '@widgets/button';
import { Icon } from '@widgets/icon';
import { ShortCutMenu } from '@components/shortcut-menu';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { bannersUrl } from '@utils/endpoints';

const BannerButton = dynamic(() => import('../../components/banner-button/index'));
const DeviceCard = dynamic(() => import('../../components/device-card/index'));
const SkindSellCard = dynamic(() => import('../../components/skin-sell/index'));
const GameCard = dynamic(() => import('../../components/game-card/index'));
const CategoryCard = dynamic(() => import('../../components/category-card/index'));
const ProductCard = dynamic(() => import('../../components/product-card/index'));

export const HomeContent: React.FC = () => {
  const { home } = useTypedSelector((store) => store);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { width } = useWindowSize();

  const [activeSlide, setActiveSlide] = useState(undefined);
  const [activeShortcut, setShowShortcut] = useState(false);

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
      console.log(error);
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
              layout="responsive"
              loading="lazy"
              unoptimized={true}
              alt="homepage banner"
              width={width}
              height={height}
              style={{ cursor: 'pointer' }}
              key={index}
              src={getFileFullUrl(banner.picture)}
              onClick={() => {
                if (activeSlide === index) {
                  user === null ? router.push(banner.secondUrl) : router.push(banner.redirectUrl);
                }
              }}
            />
          ) : (
            <Image
              key={index}
              src={getFileFullUrl(banner.picture)}
              layout="responsive"
              loading="lazy"
              unoptimized={true}
              width={width}
              height={height}
              alt="homepage banner"
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
            text="Garantía MG en todas las compras"
            border={true}
          />
          <BannerButton
            imgUrl="/assets/imgs/banners/mercadopago_1.webp"
            text="Aceptamos todos los medios de pago"
            border={true}
          />
          <BannerButton
            imgUrl="/assets/imgs/banners/ent_inmediata.webp"
            text="Recibí tu compra sin esperas"
            border={true}
          />
          <BannerButton
            imgUrl="/assets/imgs/banners/headphones_1.webp"
            text="Soporte en línea para asesorarte"
            border={false}
          />
        </div>
      ) : (
        <div className="home-mobile-banner">
          <div className="mobile-banner-button">
            <BannerButton
              imgUrl="/assets/imgs/banners/Garantia_MG_logo_PNG_5.webp"
              text="Garantía MG en todas las compras"
              border={true}
            />
            <BannerButton
              imgUrl="/assets/imgs/banners/mercadopago_1.webp"
              text="Aceptamos todos los medios de pago"
              border={true}
            />
            <BannerButton
              imgUrl="/assets/imgs/banners/ent_inmediata.webp"
              text="Recibí tu compra sin esperas"
              border={true}
            />
            <BannerButton
              imgUrl="/assets/imgs/banners/headphones_1.webp"
              text="Soporte en línea para asesorarte"
              border={false}
            />
          </div>
        </div>
      )}

      <div className="recommended-stock-section">
        <div className="recommended">
          <div className="title">Recomendados para ti</div>
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
          <div className="title">Destacados</div>
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
              content: 'Acá encontrarás las mejores ofertas de PS.',
              button: 'Descubre',
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
              content: 'Acá encontrarás las mejores ofertas para Mobile.',
              button: 'Descubre',
            }}
            onAction={() => FilterPlatform('Mobile')}
          ></DeviceCard>
        </div>
      </div>

      <div className="discount-stock-section">
        <div className="discount-week">
          <div className="title">Descuentos de la semana</div>
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
          <div className="title">Explorar juegos</div>
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
          button="Vendé ahora"
          // onAction={() => router.push(`/dashboard/inventory/add`)}
          onAction={() =>
            user === null ? router.push('/vendedores') : router.push('/dashboard/inventory/add')
          }
        ></SkindSellCard>
      </div>

      <div className="category-section">
        <div className="title">Principales categorías</div>
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
