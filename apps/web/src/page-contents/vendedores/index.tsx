import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';

import 'swiper/css';
import 'swiper/css/pagination';

import { VendorSlide } from './@widgets/slide';

import { useAppDispatch, useTypedSelector, openLoginModal } from '@web/store';
import { endpoints, put, setting } from '@utils';

const VenderSellCard = dynamic(() => import('../../components/vendor-under-banner/index'));
const ItemCard = dynamic(() => import('../../components/vendor-item/index'));


const Loading = dynamic(() => import('@widgets/loading').then(mod => mod.Loading), { ssr: false });

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

export const VendorLandingPage: React.FC = () => {
  const { t } = useTranslation('vendors');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const titleRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const { user } = useTypedSelector((store) => store.auth);

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const init = async () => {
    setLoading(true);
    try {
      if (typeof window !== 'undefined') {
        const localItem = localStorage.getItem(setting.storage.user);
        if (localItem) {
          const local_item = JSON.parse(localItem);
          if (user && local_item && user?.id === local_item?.id) {
            await ConfirmVendorPageVisit();
          }
        }
      }
    } catch (error) {
      console.error('Failed to initialize vendor page:', error);
    } finally {
      setLoading(false);
    }
  };

  const ConfirmVendorPageVisit = async (): Promise<void> => {
    try {
      if (!user?.hasFirstVisitVendor) {
        await put(endpoints.userUrl, {
          hasFirstVisitVendor: true,
        });
      }
    } catch (error) {
      console.error('Failed to confirm vendor page visit:', error);
    }
  };

  const itemlist = [
    {
      item: '/assets/imgs/vendor/Group_1417.webp',
      title: 'Cobros seguros',
      content: t('hero.subtitle'),
      width: 90,
      height: 62.22,
    },
    {
      item: '/assets/imgs/vendor/MG_img.webp',
      title: t('features.guarantee.title'),
      content: t('features.guarantee.description'),
      width: 100,
      height: 100,
    },
    {
      item: '/assets/imgs/vendor/support_img.webp',
      title: t('features.support.title'),
      content: '¿Tenés preguntas? Nuestro equipo de soporte está disponible para ayudarte.',
      width: 100,
      height: 100,
    },
  ];
  const MoveToSection = () => {
    titleRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="mercado-vendor-landing-page">
      <Loading loading={loading} />
      <div className="background">
        <div
          className="top"
          style={{
            backgroundImage: ` linear-gradient(180deg, rgba(17, 18, 23, 0) 60%, #111217 100%), url('/assets/imgs/vendor/vendor_background_01.png') `,
          }}
        ></div>
        <div
          className="bottom"
          style={{
            backgroundImage: ` linear-gradient(180deg, rgba(17, 18, 23, 0) 60%, #111217 100%), url('/assets/imgs/vendor/vendor_background_02.png')`,
          }}
        ></div>
      </div>

      <div className="body">
        <div className="header-section">
          <div className="header-gradient"></div>
          <div className="header">
            <div className="title">
              <div className="basic">
                La manera más fácil de ganar dinero real <span>vendiendo tus items digitales</span>
              </div>
              <div className="small">
                {t('how_it_works.publish.description')}
              </div>
              <div className="action">
                <Button
                  onClick={() =>
                    user === null
                      ? dispatch(openLoginModal(''))
                      : router.push('/dashboard/inventory/add')
                  }
                >
                  {t('cta.sell_now')}
                </Button>
                <Button onClick={() => MoveToSection()} kind="secondary">
                  Conocer más
                </Button>
              </div>
            </div>
            <div className="effect">
              <div
                className="container"
                style={{
                  backgroundImage: `url('/assets/imgs/vendor/circle.png') `,
                }}
              ></div>
              <div
                className="sm-circle"
                style={{
                  backgroundImage: `url('/assets/imgs/vendor/Group_1549.webp') `,
                }}
              ></div>
              <div
                className="knife"
                style={{
                  backgroundImage: `url('/assets/imgs/vendor/csgo-knife-cs-go-knife-1568324o1.webp') `,
                }}
              ></div>
              <div className="btn-group">
                <div className="effect-btn game">
                  <Icon name="controller" />
                  Juegos
                </div>
                <div className="effect-btn gift">
                  <Icon name="shopping-bag" />
                  Gift cards
                </div>
                <div className="effect-btn item">
                  <Icon name="knife" />
                  Items
                </div>
                <div className="effect-btn moneda">
                  <Icon name="database" />
                  Monedas
                </div>
                <div className="effect-btn pack">
                  <Icon name="archive" />
                  Packs
                </div>
              </div>
            </div>
          </div>
          <div className="between-right-line"></div>
        </div>

        <div className="explain-section" ref={titleRef}>
          <div className="explain-section-gradient"></div>
          <div className="content">
            <div className="title">
              Comenzá hoy a rentabilizar tus activos digitales, nosotros te ayudamos.
            </div>
            <div className="items">
              {Array.isArray(itemlist) &&
                itemlist.map((item, index) => (
                  <div className="item" key={index}>
                    <ItemCard
                      item={item.item}
                      title={item.title}
                      content={item.content}
                      width={item.width}
                      height={item.height}
                    />
                  </div>
                ))}
            </div>
          </div>

          <div className="between-left-line"></div>
        </div>

        <div className="slide-section">
          <div className="slide-section-gradient"></div>
          <div className="content">
            <VendorSlide />
          </div>
        </div>

        <div className="card-section">
          <div className="sell-by-vender-section">
            <VenderSellCard
              fileUrl="/assets/imgs/vendor/vendor-banner-background.webp"
              image="/assets/imgs/vendor/vendor-banner-image.webp"
              button={t('cta.sell_now')}
              onAction={() =>
                user !== null ? router.push(`/dashboard/inventory/add`) : dispatch(openLoginModal(''))
              }
            ></VenderSellCard>
          </div>
        </div>
      </div>
    </section>
  );
};
