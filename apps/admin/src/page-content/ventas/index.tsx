import { useEffect, useMemo } from 'react';
import { Column } from 'react-table';
import {
  getFileFullUrl,
  getHttpHeaders,
  OrderStatus,
  toCurrency,
} from '../../../../../libs/ui-shared/src/utils';
import { orderUrl } from '../../../../../libs/ui-shared/src/utils/endpoints';
import { DataTable } from '../../../../../libs/ui-shared/src/widgets/data-table';
import { Loading } from '../../../../../libs/ui-shared/src/widgets/loading';
import { Card } from '../../components/card';
import { CardContainer } from '../../components/cardContainer/cardContainer';
import { useAppDispatch, useTypedSelector } from '../../store';
import { VENTAS } from '../../store/types';
import { ImageWithFallback } from '@ui-shared/widgets/image-with-fallback';
import { StatusCard } from '@widgets/status-card';
import { ActionMenuItem } from '../../../../../libs/ui-shared/src/components/action-menu-item';
import { Search } from '@widgets/search';
import { Switcher } from '@ui-shared/components/switcher';
import { SwitcherOption } from '@ui-shared/components/switcher-option';
import { VentasSwitcherStatus } from '../../store/reducer/ventas';
import axios from 'axios';
import { Menu } from '../../../../../libs/ui-shared/src/widgets/menu';
import { Icon } from '../../../../../libs/ui-shared/src/widgets/icon';
import { ThemeColor } from '../../../../../libs/ui-shared/src/theme/color';
import { useRouter } from 'next/router';
import { Button } from '../../../../../libs/ui-shared/src/widgets/button';
import { setOrderAsReimbursed } from '../../store/actions/ventas';
import { dateOptions, getDateParam } from '@utils/common/date-filter/index';
import moment from 'moment';

export const VentasPageContent: React.FC = () => {
  const dispatch = useAppDispatch();

  const { orders, loading, analyticsData, status, search, period, page, allLoaded, loadedPeriod } =
    useTypedSelector((state) => state.ventas);

  const router = useRouter();
  const pageSize = 20;

  useEffect(() => {
    init();
  }, [status, search, period]);

  const markReimbursed = (order: OrderModelType) => {
    dispatch(setOrderAsReimbursed(order.id || (order as any)._id));
  };

  const loadAnalyticsData = async () => {
    const queryParams: any = {
      date: getDateParam(period),
    };

    const { data } = await axios.get<VentasAdminDashboardDataType>(
      orderUrl + '/adminDashboard/ventas/analytics',
      {
        ...getHttpHeaders(),
        params: queryParams,
      }
    );

    dispatch({
      type: VENTAS.SET_VALUES,
      payload: {
        analyticsData: data.analyticsData,
      },
    });
  };

  const init = async () => {
    await dispatch({
      type: VENTAS.SET_VALUES,
      payload: { loading: true, orders: [], page: -1, allLoaded: false },
    });

    const promises = [loadData(true)];

    // If period changes, load analytics data again
    if (!loadedPeriod || loadedPeriod !== period) {
      promises.push(loadAnalyticsData());
      await dispatch({
        type: VENTAS.SET_VALUES,
        payload: { loadedPeriod: period },
      });
    }

    await Promise.all(promises);

    await dispatch({
      type: VENTAS.SET_VALUES,
      payload: { loading: false },
    });
  };

  const loadData = async (resetState = false) => {
    const pageToLoad = resetState ? 0 : page + 1;

    const queryParams: any = {
      date: getDateParam(period),
      page: pageToLoad,
    };

    if (status !== VentasSwitcherStatus.ALL) {
      queryParams.status = status;
    }

    if (search && search.length > 0) {
      queryParams.search = search;
    }

    const { data } = await axios.get<VentasAdminDashboardDataType>(
      orderUrl + '/adminDashboard/ventas',
      {
        ...getHttpHeaders(),
        params: queryParams,
      }
    );

    if (resetState) {
      dispatch({
        type: VENTAS.SET_VALUES,
        payload: {
          orders: data.orders,
          page: pageToLoad,
          allLoaded: data.orders.length < pageSize,
        },
      });
    } else {
      dispatch({
        type: VENTAS.SET_VALUES,
        payload: {
          orders: [...orders, ...data.orders],
          page: pageToLoad,
          allLoaded: data.orders.length < pageSize,
        },
      });
    }
  };

  const getShorterWord = (word: string) => {
    return word.slice(0, 20);
  };

  const columns = useMemo<Column<OrderModelType & { [key: string]: any }>[]>(() => {
    return [
      {
        Header: 'Fecha y hora',
        Cell: ({ row: { original } }) => (
          <div>{moment(original.createdAt).format('DD/MM/YYYY - H:mm')}</div>
        ),
      },
      {
        Header: '',
        accessor: 'product.picture',
        width: '80px',
        Cell: ({ row: { original } }) => (
          <ImageWithFallback
            alt="Product image"
            width={50}
            height={50}
            src={getFileFullUrl(original.product?.picture)}
          />
        ),
      },
      {
        Header: 'Producto',
        width: '300px',
        Cell: ({ row: { original } }) => (
          <div className="product-column">
            <span> {original.product?.name}</span>
          </div>
        ),
      },
      {
        Header: '#',
        Cell: ({ row: { original } }) => <div>{original.number}</div>,
      },
      {
        Header: 'ID de pago',
        Cell: ({ row: { original } }) => <div>{original.paymentId || 'N/A'}</div>,
      },
      {
        Header: 'Estado',
        Cell: ({ row: { original } }) => (
          <StatusCard color={OrderStatus[original.status]?.color}>
            {OrderStatus[original.status]?.label}
          </StatusCard>
        ),
      },
      {
        Header: 'Reembolsada',
        Cell: ({ row: { original } }) => {
          if (original.status === 'cancelled' && original.paymentMethod === 'mercadoPago') {
            return (
              <div className="reimbursement-icon-container">
                {original.reimbursed ? (
                  <Icon name="check-circle" color="green" size={32} />
                ) : (
                  <Icon name="alert-triangle" color="red" size={32} />
                )}
              </div>
            );
          }

          return <></>;
        },
      },
      {
        Header: 'Total',
        Cell: ({ row: { original } }) => (
          <div>
            {toCurrency((original.productPrice || 0 + original.processingFee || 0)?.toFixed(2))}
          </div>
        ),
      },
      {
        Header: 'Pagado',
        Cell: ({ row: { original } }) => <div>{toCurrency(original.pricePaid?.toFixed(2))}</div>,
      },
      {
        Header: 'Ganancia V.',
        width: '100px',
        Cell: ({ row: { original } }) => <div>{toCurrency(original.sellerProfit?.toFixed(2))}</div>,
      },
      {
        Header: 'Vendedor',
        Cell: ({ row: { original } }) => <div>{getShorterWord(original.seller?.username)}</div>,
      },
      {
        Header: 'Comprador',
        width: '100px',
        Cell: ({ row: { original } }) => <div>{getShorterWord(original.buyer?.username)}</div>,
      },
      {
        accessor: 'action',
        Cell: ({ row: { original } }) => (
          <div className="action-menu">
            <Menu
              activator={<Icon name="more-vertical" size={24} color={ThemeColor['gray-80']} />}
              menuItems={[
                {
                  label: 'Ver detalle',
                  action: () => router.push(`/ventas/${original.id || original._id}`),
                },
                {
                  hide: original.status !== 'cancelled' || original.reimbursed,
                  label: 'Marcar como reembolsada',
                  action: () => markReimbursed(original),
                },
              ]}
            />
          </div>
        ),
      },
    ];
  }, []);

  const onSwitcherClick = (selected: VentasSwitcherStatus) => {
    dispatch({ type: VENTAS.SET_STATUS, payload: selected });
  };

  const getSwitcherOptions = () => {
    const options: [string, VentasSwitcherStatus][] = [
      ['Todos', VentasSwitcherStatus.ALL],
      ['Finalizado', VentasSwitcherStatus.FINISHED],
      ['En proceso', VentasSwitcherStatus.IN_PROCESS],
      ['Reclamos', VentasSwitcherStatus.COMPLAINT],
      ['Cancelado', VentasSwitcherStatus.CANCELLED],
    ];

    return options.map(([text, value], index) => {
      return (
        <SwitcherOption
          key={index}
          text={text}
          onClick={() => onSwitcherClick(value)}
          selected={status === value}
        />
      );
    });
  };

  let searchTimeout;

  const onSearchChange = (value: string) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    searchTimeout = setTimeout(() => {
      dispatch({
        type: VENTAS.SET_SEARCH,
        payload: value,
      });
    }, 500);
  };

  const onPeriodChange = (value: string) => {
    dispatch({
      type: VENTAS.SET_PERIOD,
      payload: value,
    });
  };

  const downloadTable = async () => {
    const { data } = await axios.get(orderUrl + '/adminDashboard/ventas/ordersCSV', {
      ...getHttpHeaders(),
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(data);
    window.open(url);
  };

  const Content = () => (
    <>
      <div className="ventas-title">
        <h1 className="title">Ventas</h1>
        <Button onClick={downloadTable}>Descargar tabla</Button>
      </div>
      <div className="ventas-header">
        <div className="ventas-search-container">
          <Search value={search} onChange={onSearchChange} />
        </div>
        <div className="ventas-switcher-container">
          <Switcher>{getSwitcherOptions()}</Switcher>
        </div>
        <div className="ventas-action-menu-container">
          <ActionMenuItem
            label="Fecha"
            value={period}
            onChange={onPeriodChange}
            items={dateOptions}
          ></ActionMenuItem>
        </div>
      </div>
      <div className="ventas-content">
        <CardContainer gridColumns={3}>
          <Card title="Ventas realizadas" values={[analyticsData.totalSells]} />
          <Card
            title="Precio promedio"
            values={[toCurrency(analyticsData.averagePrice?.toFixed(2))]}
          />
          <Card title="Nuevos compradores" values={[analyticsData.newBuyers]} />
        </CardContainer>
        <div className="table-container">
          <DataTable className="admin-ventas-table" columns={columns} data={orders} />
        </div>
        {!allLoaded && <Button onClick={() => loadData()}>Cargar mas</Button>}
      </div>
    </>
  );

  return (
    <div className="ventas-page">
      {loading && <Loading position="relative" />}
      {!loading && <Content />}
    </div>
  );
};
