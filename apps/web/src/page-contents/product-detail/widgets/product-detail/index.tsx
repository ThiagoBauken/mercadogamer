import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ActionMenuItem } from '@ui-shared/components/action-menu-item';
import { addCart, openLoginModal, useAppDispatch, useTypedSelector } from '@store';
import {
  addMessageToToast,
  endpoints,
  getFileFullUrl,
  httpGetAll,
  madeBackgroundImageUrl,
  RankingLevel,
  toUSD,
  get,
} from '@utils';
import { Button } from '@widgets/button';
import { Icon } from '@widgets/icon';
import Tooltip from '@widgets/tooltip';
import { useRouter } from 'next/router';
import { ProductDetailContext } from '../../context';
import { stat } from 'fs';

const GameTypeItem: React.FC<{ icon: string; label: string; items: any; helper?: any }> = ({
  icon,
  label,
  items,
  helper,
}) => (
  <li>
    <div className="icon">
      <Icon name={icon} />
    </div>
    <div className="label">
      {label} &nbsp;
      {items.length <= 3 && (
        <span className="item">
          {Object.keys(items)
            .map(function (k) {
              return items[k];
            })
            .join(', ')}
        </span>
      )}
    </div>
    {helper && (
      <div className="helper">
        <Tooltip tooltip={helper}>
          <Icon name="exclamation-mark-circle" />
        </Tooltip>
      </div>
    )}
    {items.length > 3 && (
      <div className="helper detail">
        <Tooltip
          tooltip={Object.keys(items)
            .map(function (k) {
              return items[k];
            })
            .join(', ')}
        >
          <div className="veiw-detail">
            {icon === 'platforms' ? 'Ver plataformas.' : 'Ver países.'}
          </div>
        </Tooltip>
      </div>
    )}
  </li>
);

export const ProductDetail: React.FC = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { user } = useTypedSelector((store) => store.auth);

  const {
    state: { product },
  } = useContext(ProductDetailContext);

  const [state, setState] = useState<{
    count: string;
    ratingSeller: ReturnType<typeof RankingLevel>;
  }>({
    count: '1',
    ratingSeller: { icon: 'null', label: '', level: 'bronze' },
  });

  const {
    cart: { carts },
  } = useTypedSelector((store) => store);

  const [sellerProfiler, setSellerProfile] = useState<UserProfileResponse>(undefined);

  useEffect(() => {
    product?.user?.id && getLevel();
    loadSellerProfile();
  }, [product]);

  const loadSellerProfile = async () => {
    try {
      if (product && product.user) {
        const profileResponse = await get(`${endpoints.userUrl}/profile/${product.user.id}/`, {
          _filters: {},
          _sort: {},
          _populates: ['platform'],
        });

        setSellerProfile(profileResponse.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getLevel = async () => {
    try {
      const reviews = await httpGetAll(endpoints.reviewUrl, {
        filter: { roleReviewed: 'seller', qualified: product?.user?.id },
      });
      setState({ ...state, ratingSeller: RankingLevel(reviews.data.count) });
    } catch (error) {
      console.log(error);
    }
  };

  const paymentMethods = useMemo<{ image: string }[]>(
    () => [
      { image: 'visa.webp' },
      { image: 'image 28.webp' },
      { image: 'naranja.webp' },
      { image: 'image 52.webp' },
      { image: 'image 53.webp' },
      { image: 'pago.webp' },
      { image: 'rapipago.webp' },
      { image: 'cabal.webp' },
      { image: 'mercado.webp' },
    ],
    []
  );

  const onAddCart = async (role: number): Promise<void> => {
    console.log(role);
    if (!user?.id) {
      dispatch(openLoginModal());
    } else {
      try {
        await addCart(product?.id, Number(state.count) || undefined);
        if (role === 1) router.push('/cart');
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

  const getUserData = () => {
    let percentage;
    if (typeof product.user === 'object') {
      percentage = (Math.round((product.user?.sellerQualification / 5) * 100) * 100) / 100;
    }

    return (
      <div className="info">
        {percentage && percentage > 0 ? `${percentage}% positivo` : 'Sin calificación'}
        <span>{sellerProfiler && ` (${sellerProfiler.finishedSales} ventas)`}</span>
      </div>
    );
  };

  return (
    <div className="product-detail">
      <div className="header">
        {/* <div className="product-number">Publicación #{product.id}</div> */}
        {/* <div className="favorite">
          <Icon name="heart" />
        </div> */}
      </div>

      <div className="title">{product?.name}</div>

      <div className="image-container">
        <div
          className="game-logo"
          style={{
            backgroundImage: madeBackgroundImageUrl(getFileFullUrl(product?.game?.picture), ''),
          }}
        ></div>
        <div className="content">
          <div
            className="product-image"
            style={{
              backgroundImage: `url('${getFileFullUrl(
                product?.picture
              )}'), url('/assets/imgs/placeholder.svg`,
            }}
          ></div>
        </div>
      </div>

      <div className="price">
        <div className="value">
          {`$${toUSD(product.discount ? product.priceWithDiscount : product.price)}`}
        </div>

        {product.discount && (
          <React.Fragment>
            <div className="discount">{`$${toUSD(product.price)}`}</div>
            <div className="discount-amount">
              {((product.price - product.priceWithDiscount) / product.price)?.toFixed(0)}
            </div>
          </React.Fragment>
        )}
      </div>

      {product?.stock === 0 && <div className="status">Sin stock</div>}
      {product?.enabled === false && <div className="eanble">Producto pausado</div>}
      {product.status !== 'approved' && <div className="eanble">Producto inhabilitado</div>}

      <ul className="game-type">
        <GameTypeItem
          icon={
            Array.isArray(product?.stockProduct) &&
            product?.stockProduct?.[0]?.retirementType === 'automatic'
              ? 'ent-inmediata'
              : 'ent-coordinada'
          }
          label={
            Array.isArray(product?.stockProduct) &&
            product?.stockProduct?.[0]?.retirementType === 'automatic'
              ? 'Entrega automática'
              : 'Entrega coordinada'
          }
          items={''}
          helper={
            Array.isArray(product.stockProduct) &&
            product?.stockProduct?.[0]?.retirementType === 'automatic'
              ? 'El producto te llegará instantáneamente al realizar la compra'
              : 'El vendedor se pondrá en contacto contigo a través del chat de la orden para la entrega'
          }
          // helper="Disponible para todos los países"
        />

        <GameTypeItem
          icon="mg-logo"
          label="Garantía MG"
          items={''}
          helper="Todas las compras en Mercado Gamer están respaldadas por la Garantía MG, si no recibes el producto como estaba detallado en la publicación te devolveremos tu dinero."
        />
        <GameTypeItem
          icon="platforms"
          label={`Disponible para`}
          items={Array.isArray(product?.platform) && product?.platform.map((item) => item.name)}
        />

        <GameTypeItem
          icon="globe"
          label={`Disponible para`}
          items={
            Array.isArray(product?.countries) && product?.countries.length !== 0
              ? product?.countries.map((item) => item)
              : ['Argentina']
          }
        />
      </ul>

      <div className="cart-count">
        <ActionMenuItem
          items={Array.from(Array(product.stock).keys()).map((index) => ({
            label: `${index + 1} unidad`,
            value: `${index + 1}`,
          }))}
          label="Cantidad:"
          value={state.count}
          onChange={(value) => setState({ ...state, count: value })}
        />
        <div className="message">{`(${product.stock} disponibles)`}</div>
      </div>

      <div className="move-cart">
        <Button
          size="big"
          width="100%"
          id="buy-now-button"
          onClick={() => {
            carts.count === 0 ||
            (carts.data !== null &&
              !carts.data.find((item, index) => item?.product.id === product.id))
              ? onAddCart(1)
              : router.push('/cart');
          }}
        >
          Comprar ahora
        </Button>
      </div>

      <div className="add-cart">
        <Button
          size="big"
          kind="secondary"
          width="100%"
          id="add-to-cart-button"
          onClick={() => onAddCart(0)}
          disabled={
            product?.stock === 0 || product?.enabled === false || product.status !== 'approved'
          }
        >
          Agregar al carrito
        </Button>
      </div>

      <div className="security">
        <div className="icon">
          <Icon name="shield-check" />
        </div>
        <div className="content">
          Para tu propia protección y para que Mercado Gamer te ayude en posibles disputas, es
          importante que nunca realices ningún pago fuera de la plataforma.
        </div>
      </div>

      <div className="information-seller">
        <div className="label">Información del vendedor</div>
        <div className="user-information">
          <div
            className="avatar"
            onClick={() => router.push(`/profile/${product.user?.id}`)}
            style={{
              backgroundImage: `url('${
                typeof product.user === 'object' ? getFileFullUrl(product?.user?.picture) : ''
              }'), url('/assets/imgs/placeholder.svg')`,
            }}
          ></div>
          <div className="content">
            <div
              className="information"
              onClick={() => router.push(`/profile/${product?.user?.id}`)}
            >
              <div className="user-name">
                {typeof product.user === 'object' ? product?.user?.username : ''}
              </div>
              {getUserData()}
            </div>
            <Tooltip position="top" tooltip={`Nivel ${state.ratingSeller.label}`}>
              <div
                className="rate"
                style={{
                  backgroundImage: madeBackgroundImageUrl(state.ratingSeller?.icon),
                }}
              ></div>
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="payment-methods">
        <div className="label">Medios de pago</div>
        <div className="description">Realizá pagos seguros con Mercado Pago.</div>
        <ul className="content">
          {paymentMethods.map((item, index) => (
            <li key={index}>
              <div
                className="image-container"
                style={{ backgroundImage: `url('/assets/imgs/${item.image}')` }}
              ></div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
