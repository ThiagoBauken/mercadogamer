import { useEffect, useMemo, useState } from 'react';
import { Column } from 'react-table';
import {
  getFileFullUrl,
  getHttpHeaders,
  LoadsStatus,
  toCurrency,
  httpGetAll,
  endpoints,
} from '../../../../../libs/ui-shared/src/utils';
import { withdrawalUrl } from '../../../../../libs/ui-shared/src/utils/endpoints';
import { DataTable } from '../../../../../libs/ui-shared/src/widgets/data-table';
import { Loading } from '../../../../../libs/ui-shared/src/widgets/loading';
import { Card } from '../../components/card';
import { CardContainer } from '../../components/cardContainer/cardContainer';
import { useAppDispatch, useTypedSelector } from '../../store';
import { LOADS } from '../../store/types';
import { ImageWithFallback } from '@ui-shared/widgets/image-with-fallback';
import { LoadCards } from '@widgets/load-card';
import { ActionMenuItem } from '../../../../../libs/ui-shared/src/components/action-menu-item';
import { Search } from '@widgets/search';
import { Switcher } from '@ui-shared/components/switcher';
import { SwitcherOption } from '@ui-shared/components/switcher-option';
import { VentasSwitcherStatus } from '../../store/reducer/ventas';
import { LoadsSwitcherStatus } from '../../store/reducer/loads';
import axios from 'axios';
import { Menu } from '../../../../../libs/ui-shared/src/widgets/menu';
import { Icon } from '../../../../../libs/ui-shared/src/widgets/icon';
import { ThemeColor } from '../../../../../libs/ui-shared/src/theme/color';
import { useRouter } from 'next/router';
import { Button } from '../../../../../libs/ui-shared/src/widgets/button';
import { setOrderAsReimbursed } from '../../store/actions/ventas';
import { dateOptions, getDateParam } from '@utils/common/date-filter/index';
import moment from 'moment';
import WithDrawlsApproveModal from '@admin/components/withdrawls-approve';
import WithDrawlsRejectModal from '@admin/components/withdrawls-reject';

export const LoadsPageContent: React.FC = () => {
  const dispatch = useAppDispatch();

  const [state, setState] = useState<{
    approvemodal: boolean;
    rejectmodal: boolean;
  }>({
    approvemodal: null,
    rejectmodal: null,
  });

  const { orders, loading, analyticsData, status, search, period, page, allLoaded, loadedPeriod } =
    useTypedSelector((state) => state.ventas);

  const router = useRouter();
  const pageSize = 20;

  useEffect(() => {
    init();
  }, [status, search, period]);

  const markReimbursed = (order: AdminWithDrawalModelType) => {
    dispatch(setOrderAsReimbursed(order.id || (order as any)._id));
  };

  const loadAnalyticsData = async () => {
    const queryParams: any = {
      date: getDateParam(period),
    };

    // const { data } = await axios.get<AdminWithDrawalModelType>(
    //   withdrawalUrl + '/adminDashboard/ventas/analytics',
    //   {
    //     ...getHttpHeaders(),
    //     params: queryParams,
    //   }
    // );

    // dispatch({
    //   type: LOADS.SET_VALUES,
    //   payload: {
    //     analyticsData: data.analyticsData,
    //   },
    // });
  };

  const init = async () => {
    await dispatch({
      type: LOADS.SET_VALUES,
      payload: { loading: true, orders: [], page: -1, allLoaded: false },
    });

    const promises = [loadData(true)];

    // If period changes, load analytics data again
    if (!loadedPeriod || loadedPeriod !== period) {
      promises.push(loadAnalyticsData());
      await dispatch({
        type: LOADS.SET_VALUES,
        payload: { loadedPeriod: period },
      });
    }

    await Promise.all(promises);

    await dispatch({
      type: LOADS.SET_VALUES,
      payload: { loading: false },
    });
  };

  const loadData = async (resetState = false) => {
    const pageToLoad = resetState ? 0 : page + 1;

    const queryParams: any = {
      date: getDateParam(period),
      page: pageToLoad,
    };

    if (status !== LoadsSwitcherStatus.ALL) {
      queryParams.status = status;
    }

    if (search && search.length > 0) {
      queryParams.search = search;
    }

    const { data } = await httpGetAll<AdminWithDrawalModelType>(withdrawalUrl, {
      ...getHttpHeaders(),
      // filter: queryParams,
      populate: ['user', 'paymentMethod', { path: 'user', populate: 'country' }],
    });

    if (resetState) {
      dispatch({
        type: LOADS.SET_VALUES,
        payload: {
          orders: data.data,
          page: pageToLoad,
          allLoaded: data.data.length < pageSize,
        },
      });
    } else {
      dispatch({
        type: LOADS.SET_VALUES,
        payload: {
          withdrawals: [...data.data, ...data.data],
          page: pageToLoad,
          allLoaded: data.data.length < pageSize,
        },
      });
    }
  };

  const getShorterWord = (word: string) => {
    return word.slice(0, 20);
  };

  const columns = useMemo<Column<AdminWithDrawalModelType & { [key: string]: any }>[]>(() => {
    return [
      {
        Header: 'ID',
        Cell: ({ row: { original } }) => (
          <div onClick={() => router.push(`/loads/${original.id}`)}>{original.id}</div>
        ),
      },
      {
        Header: 'MONTO',
        accessor: 'product.picture',
        width: '80px',
        Cell: ({ row: { original } }) => (
          <div className="product-column" onClick={() => router.push(`/loads/${original.id}`)}>
            <span> ${original.amount}</span>
          </div>
        ),
      },
      {
        Header: 'MÉTODO DE PAGO',
        width: '300px',
        Cell: ({ row: { original } }) => (
          <div className="product-column" onClick={() => router.push(`/loads/${original.id}`)}>
            <span> {original.paymentMethod.type}</span>
          </div>
        ),
      },
      {
        Header: 'USUARIO',
        Cell: ({ row: { original } }) => (
          <div onClick={() => router.push(`/loads/${original.id}`)}>{original.user?.username}</div>
        ),
      },
      {
        Header: 'FECHA',
        Cell: ({ row: { original } }) => (
          <div onClick={() => router.push(`/loads/${original.id}`)}>
            {moment(original.createdAt).format('DD/MM/YYYY')}
          </div>
        ),
      },
      {
        Header: 'MONEDA',
        Cell: ({ row: { original } }) => (
          <div className="country-currency" onClick={() => router.push(`/loads/${original.id}`)}>
            {original.user?.country?.currency}
            {
              <ImageWithFallback
                alt="Product image"
                width={20}
                height={20}
                src={getFileFullUrl(original.user?.country?.flag)}
              />
            }
          </div>
        ),
      },
      {
        Header: 'ESTADO',
        Cell: ({ row: { original } }) => (
          <div onClick={() => router.push(`/loads/${original.id}`)}>
            <LoadCards color={LoadsStatus[original.status]?.color}>
              {LoadsStatus[original.status]?.label}
            </LoadCards>
          </div>
        ),
      },
      {
        accessor: 'action',
        Cell: ({ row: { original } }) => (
          <div className="action-menu">
            <Button kind="primary" onClick={() => setState({ ...state, approvemodal: true })}>
              <Icon name="check-circle"></Icon>
            </Button>
            <Button kind="secondary" onClick={() => setState({ ...state, rejectmodal: true })}>
              <Icon name="close"></Icon>
            </Button>
          </div>
        ),
      },
    ];
  }, []);

  const onSwitcherClick = (selected: LoadsSwitcherStatus) => {
    dispatch({ type: LOADS.SET_STATUS, payload: selected });
  };

  const getSwitcherOptions = () => {
    const options: [string, LoadsSwitcherStatus][] = [
      ['Todos', LoadsSwitcherStatus.ALL],
      ['En proceso', LoadsSwitcherStatus.IN_PROCESS],
      ['Finalizado', LoadsSwitcherStatus.FINISHED],
      ['Cancelado', LoadsSwitcherStatus.CANCELLED],
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
        type: LOADS.SET_SEARCH,
        payload: value,
      });
    }, 500);
  };

  const onPeriodChange = (value: string) => {
    dispatch({
      type: LOADS.SET_PERIOD,
      payload: value,
    });
  };

  const Content = () => (
    <>
      <div className="ventas-title">
        <h1 className="title">Cargas</h1>
        {/* <Button onClick={downloadTable}>Descargar tabla</Button> */}
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
        <div className="table-container">
          <DataTable className="admin-loads-table" columns={columns} data={orders} />
        </div>
        {!allLoaded && <Button onClick={() => loadData()}>Cargar mas</Button>}
      </div>
    </>
  );

  const loadApproveModal = async (): Promise<void> => {
    try {
      // const response = await httpGetAll<TicketModelType>(endpoints.ticketUrl, {
      //   filter: { user: user.id },
      //   sort: { updatedAt: -1 },
      // });
      setState({ ...state, approvemodal: false });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="ventas-page">
      {loading && <Loading position="relative" />}
      {!loading && <Content />}
      {state.approvemodal && (
        <WithDrawlsApproveModal
          open={true}
          onClose={() => setState({ ...state, approvemodal: false })}
          onAction={loadApproveModal}
        />
      )}
      {state.rejectmodal && (
        <WithDrawlsRejectModal
          open={true}
          onClose={() => setState({ ...state, rejectmodal: false })}
          onAction={loadApproveModal}
        />
      )}
    </div>
  );
};
