// @ts-nocheck - TypeScript compatibility fix
import React, { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAppDispatch, useTypedSelector } from '@store';
import {
  defaultPagination,
  endpoints,
  getFileFullUrl,
  httpGetAll,
  del,
  madeBackgroundImageUrl,
  ProductType,
  toUSDandCurrency,
  products,
} from '@utils';
import { ThemeColor } from '@theme/color';
import { getProductPrice, ProductStatusCardInfo } from '@utils/product-functions';
import { useRouter } from 'next/router';
import { Column } from 'react-table';






import { ActionMenuItem } from '@ui-shared/components/action-menu-item';

import { useWindowSize } from '@hooks';
import { BreakPoints } from '@theme/breakpoints';
import { ProductDetailCard } from './widgets';



import { useTranslation } from 'next-i18next';

const ProductDeleteModal = dynamic(() => import('./widgets/product-delete-modal/index'), { ssr: false });


const Checkbox = dynamic(() => import('@widgets/checkbox').then(mod => mod.Checkbox), { ssr: false });

const StatusCard = dynamic(() => import('@widgets/status-card').then(mod => mod.StatusCard), { ssr: false });

const Menu = dynamic(() => import('@widgets/menu').then(mod => mod.Menu), { ssr: false });

const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

const Search = dynamic(() => import('@widgets/search').then(mod => mod.Search), { ssr: false });

const DataTable = dynamic(() => import('@widgets/data-table').then(mod => mod.DataTable), { ssr: false });

const IconButton = dynamic(() => import('@widgets/icon-button').then(mod => mod.IconButton), { ssr: false });

const Expansion = dynamic(() => import('@widgets/expansion').then(mod => mod.Expansion), { ssr: false });

const Radiobox = dynamic(() => import('@widgets/radiobox').then(mod => mod.Radiobox), { ssr: false });

export const InventoryContent: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation('dashboard');

  const { user } = useTypedSelector((store) => store.auth);

  const { width } = useWindowSize();

  const dispatch = useAppDispatch();

  const [state, setState] = useState<{
    loading: boolean;
    modal: { name: 'selected-delete' | 'one-delete' };
    filter: { status: string; type: string; order: string };
    products: PaginatedResponseType<ProductModelType>;
    showFilterInMobile: boolean;
  }>({
    loading: false,
    modal: null,
    filter: {
      status: 'all',
      type: 'all',
      order: 'recent',
    },
    products: defaultPagination,
    showFilterInMobile: false,
  });

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const selectedProductsRef = useRef(selectedProducts);
  useEffect(() => {
    selectedProductsRef.current = selectedProducts;
  });

  useEffect(() => {
    if (user?.id) {
      loadProducts();
    }
  }, [state.filter, user?.id]);

  const loadProducts = async (closeModal = true): Promise<void> => {
    try {
      if (!user?.id) return;
      setState({ ...state, loading: true });
      const filter: { [key: string]: any } = { user: user?.id, enabled: true };
      if (state.filter.status !== 'all') filter.status = state.filter.status;
      if (state.filter.type !== 'all') filter.type = state.filter.type;

      const response = await httpGetAll(endpoints.productsUrl, {
        filter,
        sort: { updatedAt: -1 },
      });
      setState({
        ...state,
        loading: false,
        products: response.data,
        modal: closeModal ? null : state.modal,
      });
    } catch (error) {
      setState({
        ...state,
        loading: false,
        products: defaultPagination,
      });
      console.log(error);
    }
  };

  const filters = useMemo<{ [key: string]: MenuItemProps[] }>(
    () => ({
      status: [{ label: t('inventory.all'), value: 'all' }].concat(
        Object.keys(ProductStatusCardInfo).map((key) => ({
          label: ProductStatusCardInfo[key].label,
          value: key,
        }))
      ),
      type: [{ label: t('inventory.all'), value: 'all' }].concat(
        Object.keys(ProductType).map((key) => ({ label: ProductType[key].label, value: key }))
      ),
      order: [
        { label: t('inventory.order_options.best_seller'), value: 'bast-seller' },
        { label: t('inventory.order_options.recent'), value: 'recent' },
        { label: t('inventory.order_options.oldest'), value: 'oldest' },
        { label: t('inventory.order_options.lower_price'), value: 'lower-price' },
        { label: t('inventory.order_options.higher_price'), value: 'higher-price' },
      ],
    }),
    [t]
  );

  const onChangeSelect = (id: string) => {
    setSelectedProducts(
      selectedProducts.includes(id)
        ? selectedProducts.filter((selected) => id != selected)
        : [...selectedProducts, id]
    );
  };

  const deleteProductBatch = async () => {
    if (!selectedProducts || selectedProducts.length === 0) return;

    const promises = [];
    selectedProducts.forEach((id) => {
      promises.push(del(`${endpoints.productsUrl}/${id}`));
    });

    await Promise.allSettled(promises);
    await loadProducts(true);
    setSelectedProducts([]);
  };

  const columns = useMemo<Column<ProductModelType & { [action: string]: any }>[]>(
    () => [
      {
        Header: '',
        accessor: 'id',
        Cell: ({ value }) => (
          <Checkbox
            onChange={() => onChangeSelect(value)}
            checked={selectedProducts.includes(value)}
          />
        ),
        width: 1,
      },
      {
        Header: '',
        accessor: 'picture',
        width: '1px',
        Cell: ({ value }) => (
          <div
            className="product-picture"
            style={{
              backgroundImage: madeBackgroundImageUrl(
                value ? getFileFullUrl(value) : '/assets/imgs/placeholder.svg',
                '/assets/imgs/placeholder.svg'
              ),
            }}
          ></div>
        ),
      },
      {
        Header: t('inventory.table.product'),
        accessor: 'name',
      },
      {
        Header: t('inventory.table.status'),
        accessor: 'status',
        width: 1,
        Cell: ({ value }) => (
          <StatusCard color={ProductStatusCardInfo[value]?.color}>
            {ProductStatusCardInfo[value]?.label}
          </StatusCard>
        ),
      },
      {
        Header: t('inventory.table.stock'),
        accessor: 'stock',
        width: 1,
        Cell: ({ value }) => <div>{value || '-'}</div>,
      },
      {
        Header: t('inventory.table.price'),
        accessor: 'price',
        width: 1,
        Cell: ({ row: { original } }) => <div>{toUSDandCurrency(getProductPrice(original))}</div>,
      },
      {
        Header: t('inventory.table.type'),
        accessor: 'publicationType',
        width: 1,
      },
      {
        accessor: 'action',
        width: 1,
        Cell: ({ row: { original } }) => (
          <div className="action-menu">
            <Menu
              activator={<Icon name="more-vertical" size={24} color={ThemeColor['gray-80']} />}
              menuItems={[
                {
                  label: t('inventory.actions.view_publication'),
                  action: () => router.push(`/product-detail/${original.id}`),
                },
                { label: t('inventory.actions.edit'), action: () => router.push(`inventory/edit/${original.id}`) },
                // { label: t('inventory.actions.pause') },
                // { label: t('inventory.actions.delete'), color: ThemeColor.negative, action: () => deleteProduct(original.id)},
                {
                  label: t('inventory.actions.delete'),
                  color: ThemeColor.negative,
                  action: () => {
                    setState({
                      ...state,
                      modal: { name: 'selected-delete' },
                    });
                    setSelectedProducts([original.id]);
                  },
                },
              ]}
            />
          </div>
        ),
      },
    ],
    [selectedProducts, state]
  );

  return (
    <section className="inventory-content-page">
      <div className="title">
        <div className="label-content">
          <div className="label">{t('inventory.title')}</div>
          <div className="count">{t('inventory.publications_count', { count: state.products?.data?.length || 0 })}</div>
        </div>
        {width > BreakPoints.lg ? (
          <div className="action">
            {selectedProducts.length ? (
              <React.Fragment>
                {/* <Button kind="secondary">{t('common.actions.download')}</Button>
                <Button kind="secondary">{t('common.actions.change_status')}</Button> */}
                <Button
                  kind="secondary"
                  onClick={() => setState({ ...state, modal: { name: 'selected-delete' } })}
                >
                  {t('inventory.delete')}
                </Button>
              </React.Fragment>
            ) : (
              <Button
                onClick={() => {
                  router.push(
                    `${user?.hasFirstVisitVendor ? '/dashboard/inventory/add' : '/vendedores'}`
                  );
                }}
              >
                {t('inventory.add_product')}
              </Button>
            )}
          </div>
        ) : (
          <div className="action">
            <div
              className="mobile-add"
              onClick={() =>
                router.push(
                  `${user?.hasFirstVisitVendor ? '/dashboard/inventory/add' : '/vendedores'}`
                )
              }
            >
              +
            </div>
          </div>
        )}
      </div>

      <div className="content">
        <div className="filter-config">
          <Search bgColor="transparent" width={width > BreakPoints.lg ? 300 : '100%'} />

          <div className="filter-menus">
            <ActionMenuItem
              label={t('inventory.filters_menu.status')}
              items={filters.status}
              value={state.filter.status}
              onChange={(value) =>
                setState({ ...state, filter: { ...state.filter, status: value } })
              }
            />

            <div className="divition"></div>

            <ActionMenuItem
              label={t('inventory.filters_menu.type')}
              items={filters.type}
              value={state.filter.type}
              onChange={(value) => setState({ ...state, filter: { ...state.filter, type: value } })}
            />

            <div className="divition"></div>

            <ActionMenuItem
              label={t('inventory.filters_menu.date')}
              items={filters.order}
              value={state.filter.order}
              onChange={(value) =>
                setState({ ...state, filter: { ...state.filter, order: value } })
              }
            />
          </div>
        </div>

        {width > BreakPoints.lg ? (
          <DataTable
            height={660}
            columns={columns}
            data={Array.isArray(state.products?.data) ? state.products?.data : []}
          />
        ) : (
          <React.Fragment>
            <Button
              full
              kind="secondary"
              onClick={() => setState({ ...state, showFilterInMobile: true })}
            >
              {t('inventory.filters')}
            </Button>
            <div className="sale-list">
              {Array.isArray(state.products?.data) &&
                state.products.data.map((product) => (
                  <ProductDetailCard
                    key={product.id}
                    product={product}
                    onDelete={() => {
                      setState({
                        ...state,
                        modal: { name: 'selected-delete' },
                      });
                      setSelectedProducts([product.id]);
                    }}
                  />
                ))}
            </div>
            {/* mobile filter */}
            {state.showFilterInMobile && (
              <div className="mobile-filter">
                <div className="content">
                  <div className="action">
                    <IconButton
                      icon="close"
                      onClick={() => setState({ ...state, showFilterInMobile: false })}
                    />
                  </div>

                  <Expansion
                    header={
                      <div className="expansion-header">
                        <div className="label">{t('inventory.filters_menu.status')}</div>
                        <div className="message">
                          {
                            filters.status.find(
                              (item) =>
                                typeof item === 'object' && item.value === state.filter.status
                            )?.label
                          }
                        </div>
                      </div>
                    }
                  >
                    <ul className="filter-group-container">
                      {filters.status.map((item, index) => (
                        <li key={index}>
                          <Radiobox
                            checked={item.value === state.filter.status}
                            onChange={() =>
                              setState({
                                ...state,
                                filter: { ...state.filter, status: item.value as string },
                              })
                            }
                          >
                            {item.label}
                          </Radiobox>
                        </li>
                      ))}
                    </ul>
                  </Expansion>

                  <Expansion
                    header={
                      <div className="expansion-header">
                        <div className="label">{t('inventory.filters_menu.type')}</div>
                        <div className="message">
                          {
                            filters.type.find(
                              (item) => typeof item === 'object' && item.value === state.filter.type
                            )?.label
                          }
                        </div>
                      </div>
                    }
                  >
                    <ul className="filter-group-container">
                      {filters.type.map((item, index) => (
                        <li key={index}>
                          <Radiobox
                            checked={item.value === state.filter.type}
                            onChange={() =>
                              setState({
                                ...state,
                                filter: { ...state.filter, type: item.value as string },
                              })
                            }
                          >
                            {item.label}
                          </Radiobox>
                        </li>
                      ))}
                    </ul>
                  </Expansion>

                  <Expansion
                    header={
                      <div className="expansion-header">
                        <div className="label">{t('inventory.filters_menu.order_by')}</div>
                        <div className="message">
                          {
                            filters.order.find(
                              (item) =>
                                typeof item === 'object' && item.value === state.filter.order
                            )?.label
                          }
                        </div>
                      </div>
                    }
                  >
                    <ul className="filter-group-container">
                      {filters.order.map((item, index) => (
                        <li key={index}>
                          <Radiobox
                            checked={item.value === state.filter.order}
                            onChange={() =>
                              setState({
                                ...state,
                                filter: { ...state.filter, order: item.value as string },
                              })
                            }
                          >
                            {item.label}
                          </Radiobox>
                        </li>
                      ))}
                    </ul>
                  </Expansion>
                </div>
              </div>
            )}
          </React.Fragment>
        )}
      </div>

      {state.modal?.name === 'selected-delete' && (
        <ProductDeleteModal
          open={true}
          onClose={() => setState({ ...state, modal: null })}
          onConfirm={deleteProductBatch}
        />
      )}
    </section>
  );
};
