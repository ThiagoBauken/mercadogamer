import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  getCategories,
  getPlatforms,
  getProductsCounts,
  useAppDispatch,
  useTypedSelector,
  addCart,
  openLoginModal,
  getProductsInCategory,
} from '@store';
import { FilterContent, GameCardFilter } from './widgets';
import { CATALOG } from '@action-types';
import { getGames } from 'apps/web/src/store/actions/game';
import { useRouter } from 'next/router';
import { addMessageToToast, endpoints, get, getDefaultCountry } from '@utils';
import { BreadCrumb } from '@widgets/bread-crumb';
import { Select } from '@widgets/select';
import { IconButton } from '@widgets/icon-button';
import { Button } from '@widgets/button';
import { Icon } from '@widgets/icon';
import { ShortCutMenu } from '@web/components/shortcut-menu';
import { Loading } from '../../../../../libs/ui-shared/src/widgets/loading';
import dynamic from 'next/dynamic';

const ProductCard = dynamic(() => import('../../components/product-card'));

export const CatalogContent: React.FC = () => {
  const {
    category: { categories },
    platform: { platforms },
    catalog: { products, filter, loading, everythingLoaded, maxPrice },
    game: { games },
  } = useTypedSelector((store) => store);

  const { user } = useTypedSelector((store) => store.auth);

  const [showFilter, setShowFilter] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const router = useRouter();

  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useCallback(
    (node) => {
      if (loading) {
        return;
      }

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !everythingLoaded) {
          incrementPage();
        }
      }) as any;

      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, !everythingLoaded]
  );

  const [activeShortcut, setShowShortcut] = useState(false);

  useEffect(() => {
    if (showFilter) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'overlay';
    }
  }, [showFilter]);

  const getMaxPrice = async () => {
    if (maxPrice) {
      return maxPrice;
    }

    const res = await get<{ price: number }>(endpoints.productsUrl + '/maxProductPrice');
    const country = getDefaultCountry();
    const p = Math.ceil(res.data.price / country.toUSD);
    await dispatch({
      type: CATALOG.SET_MAX_PRICE,
      payload: p,
    });
    return p;
  };

  const hasDifferentFilters = (newFilter: CatalogFilterType) => {
    const props = ['platform', 'category', 'delivery', 'types'];

    // Check if arrays have the same values
    if (
      props.some((val) => {
        if (newFilter[val].length !== filter[val].length) {
          return true;
        }

        return newFilter[val].some((v) => !filter[val].includes(v));
      })
    ) {
      return true;
    }

    return (
      newFilter.price.max !== filter.price.max ||
      newFilter.price.min !== filter.price.min ||
      newFilter.order !== filter.order ||
      newFilter.game !== filter.game ||
      newFilter.search !== filter.search
    );
  };

  const loadURLFilters = async () => {
    const params = new URLSearchParams(window.location.search);
    const newFilter: CatalogFilterType = {
      price: {
        min: parseInt(params.get('min'), 10) || 0,
        max: parseInt(params.get('max'), 10) || (await getMaxPrice()),
      },
      platform: params.getAll('plataforma'),
      category: params.getAll('categoria'),
      types: params.getAll('tipo'),
      order: params.get('order') || 'relevant',
      delivery: params.getAll('entrega'),
      game: params.get('juego') || '',
    };

    const search = params.get('busqueda');
    if (search) newFilter.search = search;

    return newFilter;
  };

  const incrementPage = async () => {
    if (!loading && !everythingLoaded) {
      await dispatch({ type: CATALOG.SET_VALUE, payload: { loading: true } });
      await dispatch({ type: CATALOG.INCREMENT_PAGE });
      await dispatch(getProductsInCategory());
      await dispatch({ type: CATALOG.SET_VALUE, payload: { loading: false } });
    }
  };

  // router.query triggers twice on page load so we have to use this weird flag
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!isFetching) {
      setIsFetching(true);
      routerQueryUseEffect().then(() => setIsFetching(false));
    }

    return () => {
      setIsFetching(false);
    };
  }, [router.query]);

  const routerQueryUseEffect = async () => {
    const newFilter = await loadURLFilters();
    const diff = hasDifferentFilters(newFilter);

    if (products.length > 0 && !diff) {
      return;
    }

    await dispatch({
      type: CATALOG.SET_VALUE,
      payload: { loading: true, products: [], page: 1, filter: newFilter },
    });

    await Promise.all([
      !categories.length && dispatch(getCategories()),
      !platforms.length && dispatch(getPlatforms()),
      !games.length && dispatch(getGames()),
      dispatch(getProductsCounts()),
    ]);

    dispatch(getProductsInCategory());

    await dispatch({
      type: CATALOG.SET_VALUE,
      payload: { loading: false, everythingLoaded: false },
    });
  };

  const filterChange = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    const keyVals = params.getAll(key);

    switch (key) {
      case 'order':
        params.delete(key);
        if (value !== 'relevant') {
          params.append(key, value);
        }
        break;

      case 'price.min':
        if (Number(value) === 0) {
          return;
        }
        params.delete('min');
        params.append('min', value);
        break;

      case 'price.max':
        if (Number(value) === maxPrice) {
          return;
        }
        params.delete('max');
        params.append('max', value);
        break;

      case 'game':
        const presentParam = params.get('juego');
        params.delete('juego');
        if (!presentParam || presentParam !== value) {
          params.append('juego', value);
        }
        break;

      default:
        if (keyVals.includes(value)) {
          params.delete(key);
          const newVals = keyVals.filter((val) => val !== value);
          newVals.forEach((v) => params.append(key, v));
        } else {
          params.append(key, value);
        }
    }
    router.push('?' + params);
  };

  const breadCrumbItems = useMemo(() => ['Catálogo'], []);

  const orderItems = useMemo<MenuItemProps[]>(
    () => [
      { label: 'Más relevantes', value: 'relevant' },
      { label: 'Menor precio', value: 'low-price' },
      { label: 'Mayor precio', value: 'high-price' },
    ],
    []
  );

  const onChangeOrder = (order: any) => {
    filterChange('order', order);
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

  const onClickGameCard = (game: GameModelType): void => {
    filterChange('game', game.name);
  };

  return (
    <section className="mercadco-catalog-page">
      {loading && !maxPrice && <Loading />}
      <div className="header">
        <BreadCrumb items={breadCrumbItems} />
        <div className="order">
          <div className="label">Ordenar por</div>
          <Select value={filter.order} miniSize items={orderItems} onChange={onChangeOrder} />
        </div>
      </div>
      <div className={`filter-content${showFilter ? ' active' : ''}`}>
        <div className="action">
          <IconButton icon="left-direction" onClick={() => setShowFilter(false)} />
          <div className="title">Filtros</div>
        </div>
        {maxPrice && filter.price.max && (
          <FilterContent
            maxPrice={maxPrice}
            orderItems={orderItems}
            filter={filter}
            setFilter={filterChange}
            onChangeOrder={onChangeOrder}
          />
        )}
      </div>
      <div className="content">
        <div className="mobile-title">Catálogo</div>
        <div className="games-content">
          <div className="mobile-juego-title">Filtrar por juegos</div>
          {Array.isArray(games) && (
            <GameCardFilter
              games={games}
              selectedGame={filter.game}
              onClickGameCard={onClickGameCard}
            />
          )}
        </div>
        {loading && maxPrice && <Loading position="relative" />}
        {products.length > 0 && (
          <>
            <div className="products-content">
              {Array.isArray(products) &&
                products.map((product, index) => {
                  if (index === products.length - 1) {
                    return (
                      <ProductCard
                        product={product}
                        key={index}
                        href={`/product-detail/${product.id}`}
                        onClick={() => onAddCart(product.id)}
                        passedRef={lastElementRef}
                      />
                    );
                  } else {
                    return (
                      <ProductCard
                        product={product}
                        key={index}
                        href={`/product-detail/${product.id}`}
                        onClick={() => onAddCart(product.id)}
                      />
                    );
                  }
                })}
            </div>
            {!everythingLoaded && (
              <Button
                full={true}
                radius={5}
                className="load-more-button"
                size="big"
                onClick={incrementPage}
              >
                {loading ? 'Cargando...' : 'Cargar mas'}
              </Button>
            )}
          </>
        )}
        {!loading && everythingLoaded && products.length === 0 && (
          <p className="no-products-found-text">
            No se encontró ningun producto para los filtros seleccionados
          </p>
        )}
      </div>
      <div className="filter-action">
        <Button size="big" onClick={() => setShowFilter(true)}>
          Filtros
        </Button>
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
