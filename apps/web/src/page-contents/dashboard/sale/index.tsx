// @ts-nocheck - TypeScript compatibility fix
import React, { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTypedSelector } from '@store';
import {
  addMessageToToast,
  defaultPagination,
  endpoints,
  get,
  getFileFullUrl,
  httpGetAll,
  madeBackgroundImageUrl,
  OrderStatus,
  setting,
  toCurrency,
} from '@utils';
import { ThemeColor } from '@theme/color';
import { useRouter } from 'next/router';
import { Column } from 'react-table';
import moment from 'moment';

import { useSocket } from '@web/hooks/use-socket';
import { BreakPoints } from '@theme/breakpoints';





import { ActionMenuItem } from '@ui-shared/components/action-menu-item';




import { useWindowSize } from '@hooks';
import { orderUrl } from '../../../../../../libs/ui-shared/src/utils/endpoints';
import { useTranslation } from 'next-i18next';

const CancelModal = dynamic(() => import('./widgets/cancel-modal/index'), { ssr: false });

interface AnalyticsData {
  sellerProfit: number;
  complaint: number;
  pending: number;
}


const StatusCountCard = dynamic(() => import('./widgets').then(mod => mod.StatusCountCard), { ssr: false });
const SaleDetailCard = dynamic(() => import('./widgets').then(mod => mod.SaleDetailCard), { ssr: false });

const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

const StatusCard = dynamic(() => import('@widgets/status-card').then(mod => mod.StatusCard), { ssr: false });

const Menu = dynamic(() => import('@widgets/menu').then(mod => mod.Menu), { ssr: false });

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

const Search = dynamic(() => import('@widgets/search').then(mod => mod.Search), { ssr: false });

const DataTable = dynamic(() => import('@widgets/data-table').then(mod => mod.DataTable), { ssr: false });

const IconButton = dynamic(() => import('@widgets/icon-button').then(mod => mod.IconButton), { ssr: false });

const Expansion = dynamic(() => import('@widgets/expansion').then(mod => mod.Expansion), { ssr: false });

const Radiobox = dynamic(() => import('@widgets/radiobox').then(mod => mod.Radiobox), { ssr: false });

export const SalePageContent: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation('dashboard');

  const { socket } = useSocket();

  const { user } = useTypedSelector((store) => store.auth);

  const { width } = useWindowSize();

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(undefined);
  const [everythingLoaded, setEverythingLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [state, setState] = useState<{
    loading: boolean;
    filter: { status: string; date: string };
    orders: OrderModelType[];
    status: { profit: string; pending: number; returned: number };
    showFilterInMobile: boolean;
    modal: { name: '' | 'cancel-modal'; order: OrderModelType };
  }>({
    loading: false,
    filter: {
      status: 'all',
      date: 'all',
    },
    orders: [],
    status: {
      profit: `$0.00`,
      pending: 0,
      returned: 0,
    },
    showFilterInMobile: false,
    modal: { name: '', order: null },
  });

  const stateRef = useRef<typeof state>(state);

  useEffect(() => {
    stateRef.current = state;
  });

  useEffect(() => {
    if (user?.id) {
      loadOrders(true);
    }
  }, [state.filter, user?.id]);

  useEffect(() => {
    if (page > 1) {
      loadOrders();
    }
  }, [page]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const { data } = await get<AnalyticsData>(orderUrl + '/userAnalytics');
    setAnalyticsData(data);
  };

  const getFilter = () => {
    const filter: { [key: string]: any } = { seller: user?.id };
    if (state.filter.status !== 'all') filter.status = state.filter.status;

    const today = moment();
    const lastMonth = moment().add(-1, 'month');
    if (state.filter.date !== 'all') {
      switch (state.filter.date) {
        case 'this-month':
          filter.updatedAt = { $gte: moment(today.format('YYYY-MM'), 'YYYY-MM') };
          break;
        case 'last-month':
          filter.updatedAt = {
            $gte: moment(lastMonth.format('YYYY-MM'), 'YYYY-MM'),
            $lte: moment(today.format('YYYY-MM'), 'YYYY-MM'),
          };
          break;
        case 'this-year':
          filter.updatedAt = {
            $gte: moment(lastMonth.format('YYYY'), 'YYYY'),
          };
          break;
      }
    }
    return filter;
  };

  const loadOrders = async (resetState = false): Promise<void> => {
    try {
      if (!user?.id) return;
      setState({ ...state, loading: true });

      const filter = getFilter();

      const { data } = await httpGetAll<OrderModelType>(endpoints.orderUrl, {
        filter,
        sort: { createdAt: -1 },
        populate: ['product', 'stockProduct'],
        page,
        perPage: 20,
      });

      if (data.data.length < 20) {
        setEverythingLoaded(true);
      }

      setState({
        ...state,
        loading: false,
        orders: resetState ? data.data : [...state.orders, ...data.data],
        modal: {
          name: '',
          order: null,
        },
      });
    } catch (error) {
      console.error(error);
      setState({
        ...state,
        loading: false,
        orders: [],
      });
    }
  };

  const filters = useMemo<{ [key: string]: MenuItemProps[] }>(
    () => ({
      status: [{ label: t('sales.status_options.all'), value: 'all' }].concat(
        Object.keys(OrderStatus)
          .filter((key) => !['pending', 'returned'].includes(key))
          .map((key) => ({
            label: OrderStatus[key].label,
            value: key,
          }))
      ),
      state: [
        { label: t('sales.status_options.all'), value: 'all' },
        { label: t('sales.status_options.finished'), value: 'finished' },
        { label: t('sales.status_options.in_process'), value: 'paid' },
        { label: t('sales.status_options.complaint'), value: 'complaint' },
        { label: t('sales.status_options.cancelled'), value: 'cancelled' },
      ],
      date: [
        { label: t('sales.date_options.all'), value: 'all' },
        { label: t('sales.date_options.this_month'), value: 'this-month' },
        { label: t('sales.date_options.last_month'), value: 'last-month' },
        { label: t('sales.date_options.this_year'), value: 'this-year' },
      ],
    }),
    [t]
  );

  const getProductPrice = (original: OrderModelType) => {
    return original.productPrice
      ? original.productPrice
      : original.pricePaid
      ? original.pricePaid
      : original.sellerProfit;
  };

  const columns = useMemo<Column<OrderModelType & { [key: string]: any }>[]>(
    () => [
      {
        Header: '',
        accessor: 'product.picture',
        width: '1px',
        Cell: ({ value, row: { original } }) => (
          <div
            className="product-picture"
            style={{
              backgroundImage: madeBackgroundImageUrl(
                value ? getFileFullUrl(value) : '/assets/imgs/placeholder.svg',
                '/assets/imgs/placeholder.svg'
              ),
            }}
            onClick={() => router.push(`/dashboard/sale/${original.id}`)}
          ></div>
        ),
      },
      {
        Header: t('sales.table.order_number'),
        accessor: 'number',
        width: '76px',
        Cell: ({ row: { original } }) => (
          <div
            className="product-name"
            onClick={() => router.push(`/dashboard/sale/${original.id}`)}
          >
            #{original.number}
          </div>
        ),
      },
      {
        Header: t('sales.table.product'),
        accessor: 'product.name',
        Cell: ({ value, row: { original } }) => (
          <div
            className="product-name"
            onClick={() => router.push(`/dashboard/sale/${original.id}`)}
          >
            {value}
          </div>
        ),
      },
      {
        Header: '',
        accessor: 'delivery',
        width: 1,
        Cell: ({ row: { original } }) => (
          <Icon
            name={
              original?.stockProduct?.retirementType === 'automatic'
                ? 'ent-inmediata'
                : 'ent-coordinada'
            }
            size={20}
            color={ThemeColor['gray-60']}
          ></Icon>
        ),
      },
      {
        Header: t('sales.table.status'),
        accessor: 'status',
        width: 1,
        Cell: ({ value }) => (
          <StatusCard color={OrderStatus[value]?.color}>{OrderStatus[value]?.label}</StatusCard>
        ),
      },
      {
        Header: t('sales.table.date'),
        accessor: 'updatedAt',
        width: 1,
        Cell: ({ value }) => <React.Fragment>{moment(value).format('DD/MM/YYYY')}</React.Fragment>,
      },
      {
        Header: t('sales.table.price'),
        accessor: 'product.price',
        width: '100px',
        Cell: ({ row: { original } }) => (
          <div>{toCurrency((getProductPrice(original) || 0).toFixed(2))}</div>
        ),
      },
      {
        Header: t('sales.table.profit'),
        accessor: 'product.sellerprofit',
        width: '100px',
        Cell: ({ row: { original } }) => <div>{toCurrency((original.sellerProfit || 0).toFixed(2))}</div>,
      },
      {
        Header: <Icon name="mail" size={24} />,
        accessor: 'hasUnreadMessage',
        width: 1,
        Cell: ({ row: { original }, value }) => {
          if (!['finished', 'cancelled'].includes(original.status) && original.hasUnreadMessage)
            return <div className={`has-unread-message${value ? ' active' : ''}`}></div>;
          else return <></>;
        },
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
                  label: t('sales.actions.view_detail'),
                  action: () => router.push(`/dashboard/sale/${original.id}`),
                },
                { label: t('sales.actions.download'), hide: true },
                // { label: 'Pausar' },
                {
                  label: t('sales.actions.cancel_sale'),
                  color: ThemeColor.negative,
                  hide: ['cancelled', 'finished'].includes(original.status),
                  action: () =>
                    setState({
                      ...stateRef.current,
                      modal: { name: 'cancel-modal', order: original },
                    }),
                },
              ]}
            />
          </div>
        ),
      },
    ],
    [t]
  );

  const cancelOrder = (): void => {
    if (state.modal.order) {
      socket.emit(setting.socketEvents.cancelOrder, state.modal.order.id);
      addMessageToToast(t('sales.cancel_message'), {
        status: 'error',
        icon: 'alert-triangle',
      });
      setState({
        ...state,
        modal: { name: '', order: null },
      });
      loadOrders();
    }
  };

  return (
    <section className="sale-content-page">
      {width > BreakPoints.lg ? (
        <div className="title">
          <div className="label">{t('sales.title')}</div>
          <div className="count">{t('sales.sales_count_plural', { count: state.orders?.length || 0 })}</div>
          <div className="action">
            {/* {selected?.length ? (
              <Button kind="secondary">Descargar</Button>
            ) : (
              <Menu
                activator={
                  <div className="download-type-menu">
                    <Icon name="more-vertical" />
                  </div>
                }
                menuItems={[{ label: 'Descargar lista' }]}
              ></Menu>
            )} */}
          </div>
        </div>
      ) : (
        <div className="mobile-title">
          <div className="title">
            <div className="label">{t('sales.title')}</div>
            <div className="count">{t('sales.sales_count_plural', { count: state.orders?.length || 0 })}</div>
          </div>
          <div className="action">
            {/* {selected?.length ? (
              <Button kind="secondary">Descargar</Button>
            ) : (
              <Menu
                activator={
                  <div className="download-type-menu">
                    <Icon name="more-vertical" />
                  </div>
                }
                menuItems={[{ label: 'Descargar lista' }]}
              ></Menu>
            )} */}
          </div>
        </div>
      )}

      <div className="content">
        <div className="orders-status">
          <StatusCountCard
            label={t('sales.cards.earnings')}
            value={toCurrency((analyticsData?.sellerProfit || 0).toFixed(2))}
          />
          <StatusCountCard label={t('sales.cards.sales_in_process')} value={analyticsData?.pending || 0} />
          <StatusCountCard label={t('sales.cards.complaints')} value={analyticsData?.complaint || 0} />
        </div>

        <div className="filter-config">
          <Search bgColor="transparent" width={300} placeholder={t('sales.search_placeholder')} />

          <div className="filter-menus">
            <ActionMenuItem
              label={t('sales.filters_menu.status')}
              items={filters.status}
              value={state.filter.status}
              onChange={(value) =>
                setState({ ...state, filter: { ...state.filter, status: value } })
              }
            />

            <div className="divition"></div>

            <ActionMenuItem
              label={t('sales.filters_menu.date')}
              items={filters.date}
              value={state.filter.date}
              onChange={(value) => setState({ ...state, filter: { ...state.filter, date: value } })}
            />
          </div>
        </div>
        {width > BreakPoints.lg ? (
          <DataTable
            height={660}
            columns={columns}
            data={Array.isArray(state.orders) ? state.orders : []}
            LastElement={() => (
              <div className="table-button-container">
                {!everythingLoaded && <Button onClick={() => setPage(page + 1)}>{t('sales.load_more')}</Button>}
              </div>
            )}
          />
        ) : (
          <React.Fragment>
            <Button
              full
              kind="secondary"
              onClick={() => setState({ ...state, showFilterInMobile: true })}
            >
              {t('sales.filters')}
            </Button>
            <div className="sale-list">
              {Array.isArray(state.orders) &&
                state.orders.map((order, index) => <SaleDetailCard key={index} sale={order} />)}
            </div>
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
                        <div className="label">{t('sales.filters_menu.status')}</div>
                        <div className="message">
                          {
                            filters.state.find(
                              (item) =>
                                typeof item === 'object' && item.value === state.filter.status
                            )?.label
                          }
                        </div>
                      </div>
                    }
                  >
                    <ul className="filter-group-container">
                      {filters.state.map((item, index) => (
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
                        <div className="label">{t('sales.filters_menu.date')}</div>
                        <div className="message">
                          {
                            filters.date.find(
                              (item) => typeof item === 'object' && item.value === state.filter.date
                            )?.label
                          }
                        </div>
                      </div>
                    }
                  >
                    <ul className="filter-group-container">
                      {filters.date.map((item, index) => (
                        <li key={index}>
                          <Radiobox
                            checked={item.value === state.filter.date}
                            onChange={() =>
                              setState({
                                ...state,
                                filter: { ...state.filter, date: item.value as string },
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

      {state.modal.name === 'cancel-modal' && (
        <CancelModal
          open={true}
          onAction={cancelOrder}
          onClose={() => setState({ ...state, modal: { name: '', order: null } })}
        />
      )}
    </section>
  );
};
