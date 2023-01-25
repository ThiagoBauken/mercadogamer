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
import { StatusCountCard, SaleDetailCard } from './widgets';
import { useSocket } from '@web/hooks/use-socket';
import { BreakPoints } from '@theme/breakpoints';
import { Icon } from '@widgets/icon';
import { StatusCard } from '@widgets/status-card';
import { Menu } from '@widgets/menu';
import { Button } from '@widgets/button';
import { Search } from '@widgets/search';
import { ActionMenuItem } from '@ui-shared/components/action-menu-item';
import { DataTable } from '@widgets/data-table';
import { IconButton } from '@widgets/icon-button';
import { Expansion } from '@widgets/expansion';
import { Radiobox } from '@widgets/radiobox';
import { useWindowSize } from '@hooks';
import { orderUrl } from '../../../../../../libs/ui-shared/src/utils/endpoints';

const CancelModal = dynamic(() => import('./widgets/cancel-modal/index'));

interface AnalyticsData {
  sellerProfit: number;
  complaint: number;
  pending: number;
}

export const SalePageContent: React.FC = () => {
  const router = useRouter();

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
      status: [{ label: 'Todos', value: 'all' }].concat(
        Object.keys(OrderStatus)
          .filter((key) => !['pending', 'returned'].includes(key))
          .map((key) => ({
            label: OrderStatus[key].label,
            value: key,
          }))
      ),
      state: [
        { label: 'Todos', value: 'all' },
        { label: 'Finalizado', value: 'finished' },
        { label: 'En proceso', value: 'paid' },
        { label: 'Reclamo', value: 'complaint' },
        { label: 'Cancelado', value: 'cancelled' },
      ],
      date: [
        { label: 'Todas', value: 'all' },
        { label: 'Este mes', value: 'this-month' },
        { label: 'Mes pasado', value: 'last-month' },
        { label: 'Este año', value: 'this-year' },
      ],
    }),
    []
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
        Header: 'Nº ORDEN',
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
        Header: 'PRODUCTO',
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
        Header: 'ESTADO',
        accessor: 'status',
        width: 1,
        Cell: ({ value }) => (
          <StatusCard color={OrderStatus[value]?.color}>{OrderStatus[value]?.label}</StatusCard>
        ),
      },
      {
        Header: 'FECHA',
        accessor: 'updatedAt',
        width: 1,
        Cell: ({ value }) => <React.Fragment>{moment(value).format('DD/MM/YYYY')}</React.Fragment>,
      },
      {
        Header: 'PRECIO',
        accessor: 'product.price',
        width: '100px',
        Cell: ({ row: { original } }) => (
          <div>{toCurrency(getProductPrice(original).toFixed(2))}</div>
        ),
      },
      {
        Header: 'GANANCIA',
        accessor: 'product.sellerprofit',
        width: '100px',
        Cell: ({ row: { original } }) => <div>{toCurrency(original.sellerProfit?.toFixed(2))}</div>,
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
                  label: 'Ver detalle',
                  action: () => router.push(`/dashboard/sale/${original.id}`),
                },
                { label: 'Descargar', hide: true },
                // { label: 'Pausar' },
                {
                  label: 'Cancelar venta',
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
    []
  );

  const cancelOrder = (): void => {
    if (state.modal.order) {
      socket.emit(setting.socketEvents.cancelOrder, state.modal.order.id);
      addMessageToToast('Se canceló la venta.', {
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
          <div className="label">Ventas</div>
          <div className="count">{`${state.orders?.length || 0} ventas`}</div>
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
            <div className="label">Ventas</div>
            <div className="count">{`${state.orders?.length || 0} ventas`}</div>
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
            label="Ganancias"
            value={toCurrency(analyticsData?.sellerProfit.toFixed(2) || 0)}
          />
          <StatusCountCard label="Ventas en proceso" value={analyticsData?.pending || 0} />
          <StatusCountCard label="Reclamos" value={analyticsData?.complaint || 0} />
        </div>

        <div className="filter-config">
          <Search bgColor="transparent" width={300} placeholder="Buscar" />

          <div className="filter-menus">
            <ActionMenuItem
              label="Estado"
              items={filters.status}
              value={state.filter.status}
              onChange={(value) =>
                setState({ ...state, filter: { ...state.filter, status: value } })
              }
            />

            <div className="divition"></div>

            <ActionMenuItem
              label="Fecha"
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
                {!everythingLoaded && <Button onClick={() => setPage(page + 1)}>Cargar mas</Button>}
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
              Filtros
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
                        <div className="label">Estado</div>
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
                        <div className="label">Fecha</div>
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
