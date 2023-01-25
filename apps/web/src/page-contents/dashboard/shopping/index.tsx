import { useTypedSelector } from '@store';
import dynamic from 'next/dynamic';
import { ThemeColor } from '@theme/color';
import {
  endpoints,
  getFileFullUrl,
  httpGetAll,
  madeBackgroundImageUrl,
  setting,
  toUSD,
} from '@utils';
import React, { useEffect, useMemo, useState } from 'react';
import { ProductFunctions } from '@utils';
import { OrderDetailCard, ShoppingCard } from './widgets';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useSocket } from '@web/hooks/use-socket';
import { BreakPoints } from '@theme/breakpoints';
import { Search } from '@widgets/search';
import { ActionMenuItem } from '@ui-shared/components/action-menu-item';
import { Icon } from '@widgets/icon';
import { OrderStatusBadge } from '@components/order-status';
import { Menu } from '@widgets/menu';
import { Button } from '@widgets/button';
import { IconButton } from '@widgets/icon-button';
import { Expansion } from '@widgets/expansion';
import { Radiobox } from '@widgets/radiobox';
import { useWindowSize } from '@hooks';

const ConfirmModal = dynamic(() => import('@components/confirm-modal/index'));
const ReportModal = dynamic(() => import('../../../components/report-modal/index'));
const RateUser = dynamic(() => import('@components/rate-user/index'));

export const ShoppingContent: React.FC = () => {
  const router = useRouter();

  const { socket } = useSocket();

  const { user } = useTypedSelector((store) => store.auth);

  const { width } = useWindowSize();

  const [state, setState] = useState<{
    orders: PaginatedResponseType<OrderModelType>;
    filter: {
      status: string;
      date: string;
      type: string;
    };
    order: string;
    showFilterInMobile: boolean;
    modal: {
      name: '' | 'confirm-modal' | 'rate-user' | 'report-modal';
      order: OrderModelType;
    };
  }>({
    orders: null,
    filter: {
      status: 'all',
      date: 'all',
      type: 'all',
    },
    order: '',
    showFilterInMobile: false,
    modal: {
      name: '',
      order: null,
    },
  });

  useEffect(() => {
    user?.id && onLoadOrder();
  }, [state.filter.date, state.order, user?.id]);

  const filters = useMemo<{ [key: string]: MenuItemProps[] }>(
    () => ({
      state: [
        { label: 'Todos', value: 'all' },
        { label: 'Finalizado', value: 'finished' },
        { label: 'Pendientes', value: 'pending' },
        { label: 'Pagadas', value: 'paid' },
        { label: 'Reclamo', value: 'complaint' },
        { label: 'Cancelado', value: 'cancelled' },
      ],
      type: [
        { label: 'Todos', value: 'all' },
        { label: 'Juego', value: 'game' },
        { label: 'Gift card', value: 'giftCard' },
        { label: 'Item', value: 'item' },
        { label: 'Monedas', value: 'monedas' },
        { label: 'Packs', value: 'pack' },
      ],
      date: [
        { label: 'Todas', value: 'all' },
        { label: 'Este mes', value: 'month' },
        { label: 'Mes pasado', value: 'before-month' },
        { label: 'Este año', value: 'year' },
      ],
    }),
    []
  );

  const onLoadOrder = async (): Promise<void> => {
    try {
      const filter: { [key: string]: any } = { buyer: user.id };
      if (state.filter.date !== 'all') {
        const today = moment();
        switch (state.filter.date) {
          case 'month':
            const date = new Date();
            date.setMonth(date.getMonth() - 1);
            filter.createdAt = { $gte: date };
            break;
          case 'before-month':
            filter.createdAt = {
              $lte: moment(today.format('YYYY-MM'), 'YYYY-MM').toISOString(),
              $gte: moment(today.add(-1, 'M').format('YYYY-MM'), 'YYYY-MM'),
            };
            break;
          case 'year':
            filter.createdAt = { $gte: moment(today.format('YYYY'), 'YYYY').toISOString() };
        }
      }

      const response = await httpGetAll(endpoints.orderUrl, {
        filter,
        populate: ['product', 'seller', 'buyer', 'stockProduct'],
        sort: { updatedAt: -1 },
      });

      setState({ ...state, orders: response.data, modal: { name: '', order: null } });
    } catch (error) {
      console.log(error);
    }
  };

  const finishedOrders = useMemo(
    () => (state.orders ? state.orders.data?.filter((item) => item.status == 'finished') : []),
    [state.orders?.data]
  );

  const onClose = () => setState({ ...state, modal: { name: '', order: null } });

  return (
    <section className="shopping-content">
      <div className="title">
        Compras<span>{`${state.orders?.data?.length} compras`}</span>
      </div>

      <div className="shopping-info">
        <ShoppingCard
          title="Compras realizadas"
          value={finishedOrders.length}
          // image={getFileFullUrl(finishedOrders[finishedOrders.length - 1]?.product.picture)}
        />

        {width > BreakPoints.lg ? (
          <ShoppingCard
            title="Calificación de comprador"
            value={
              state.orders
                ? Math.round(state.orders?.data[0]?.buyer.sellerQualification * 100 || 0) / 100
                : 0.0
            }
          />
        ) : (
          <ShoppingCard
            title="Calif. comprador"
            value={
              state.orders
                ? Math.round(state.orders?.data[0]?.buyer.sellerQualification * 100 || 0) / 100
                : 0.0
            }
          />
        )}

        <ShoppingCard
          title="En proceso"
          value={state.orders?.data?.filter((item) => item.status == 'paid').length}
        />
      </div>
      <div className="content">
        <div className="header">
          <Search bgColor="transparent" placeholder="Buscar" />
          <div className="action-menu">
            <ActionMenuItem
              label="Estado"
              items={filters.state}
              value={state.filter.status}
              onChange={(value) =>
                setState({ ...state, filter: { ...state.filter, status: value } })
              }
            />

            <ActionMenuItem
              label="Tipo"
              items={filters.type}
              value={state.filter.type}
              onChange={(value) => setState({ ...state, filter: { ...state.filter, type: value } })}
            />

            <ActionMenuItem
              label="Fecha"
              items={filters.date}
              value={state.filter.date}
              onChange={(value) => setState({ ...state, filter: { ...state.filter, date: value } })}
            />
          </div>
        </div>
        {width > BreakPoints.lg ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '1px' }}></th>
                  <th>PRODUCTO</th>
                  <th style={{ width: '1px' }}></th>
                  <th>ESTADO</th>
                  <th>FECHA</th>
                  <th>PRECIO</th>
                  <th>
                    <Icon name="mail" size={24} />
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(state.orders?.data) &&
                  state.orders.data
                    .filter(
                      (order) =>
                        (state.filter.status === 'all' || state.filter.status === order.status) &&
                        (state.filter.type === 'all' || state.filter.type === order.product?.type)
                    )
                    .map((order, index) => (
                      <tr key={index}>
                        <td>
                          <div
                            className="product-picture"
                            style={{
                              backgroundImage: madeBackgroundImageUrl(
                                getFileFullUrl(order.product?.picture)
                              ),
                            }}
                            onClick={() => router.push(`/dashboard/order/${order.id}`)}
                          ></div>
                        </td>
                        {/* Product name */}
                        <td
                          className="product-name"
                          onClick={() => router.push(`/dashboard/order/${order.id}`)}
                        >
                          {order.product?.name}
                        </td>

                        {/* delivery */}
                        <td>
                          <Icon
                            name={
                              order?.stockProduct?.retirementType === 'automatic'
                                ? 'ent-inmediata'
                                : 'ent-coordinada'
                            }
                            size={24}
                            color={ThemeColor['gray-60']}
                          />
                        </td>

                        {/* status */}
                        <td>
                          <OrderStatusBadge status={order.status} />
                        </td>

                        {/* Date */}
                        <td>{moment(order.updatedAt).format('DD/MM/YYYY')}</td>

                        {/* price */}
                        <td>
                          $
                          {order.productPrice?.toFixed(2) ||
                            toUSD(ProductFunctions.getProductPrice(order.product))}
                        </td>

                        {/** message read status */}
                        <td>
                          {order?.hasUnreadMessage &&
                            !['finished', 'cancelled'].includes(order.status) && (
                              <div className="has-message"></div>
                            )}
                        </td>

                        {/* action */}
                        <td>
                          <div className="action-menu">
                            <Menu
                              activator={
                                <Icon
                                  name="more-vertical"
                                  size={24}
                                  color={ThemeColor['gray-80']}
                                />
                              }
                              menuItems={[
                                {
                                  label: 'Detalle',
                                  action: () => router.push(`/dashboard/order/${order.id}`),
                                },
                                // { label: 'Ver código' },
                                {
                                  label: 'Finalizar transacción',
                                  hide: ['finished', 'cancelled'].includes(order.status),
                                  action: () =>
                                    setState({
                                      ...state,
                                      modal: { name: 'confirm-modal', order: order },
                                    }),
                                },
                                {
                                  label: 'Tuve un problema',
                                  hide: ['finished', 'cancelled', 'complaint'].includes(
                                    order.status
                                  ),
                                  action: () =>
                                    setState({
                                      ...state,
                                      modal: { name: 'report-modal', order: order },
                                    }),
                                },
                              ]}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        ) : (
          <React.Fragment>
            <Button
              full
              kind="secondary"
              onClick={() => setState({ ...state, showFilterInMobile: true })}
            >
              Filtros
            </Button>
            <div className="order-list">
              {Array.isArray(state.orders?.data) &&
                state.orders.data
                  .filter(
                    (order) =>
                      state.filter.type === 'all' || order?.product?.type === state.filter.type
                  )
                  .map((order, index) => <OrderDetailCard key={index} order={order} />)}
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
                        <div className="label">Tipo</div>
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

      {state.modal.name === 'confirm-modal' && (
        <ConfirmModal
          open={state.modal.name === 'confirm-modal'}
          onAction={() => setState({ ...state, modal: { ...state.modal, name: 'rate-user' } })}
          onClose={onClose}
        />
      )}

      {state.modal.name === 'rate-user' && (
        <RateUser
          open={state.modal.name === 'rate-user'}
          order={state.modal.order}
          ratingUser={
            user.id === state.modal.order.seller.id
              ? state.modal.order.buyer
              : state.modal.order.seller
          }
          rateContent={{
            order: state.modal.order.id,
            qualified:
              state.modal.order?.seller?.id === user.id
                ? state.modal.order?.buyer?.id
                : state.modal.order?.seller?.id,
            roleReviewed: state.modal.order?.seller?.id === user.id ? 'user' : 'seller',
          }}
          onClose={onClose}
          onAction={() => {
            onLoadOrder();
          }}
        />
      )}

      {state.modal.name === 'report-modal' && state.modal.order && (
        <ReportModal
          open={state.modal.name === 'report-modal'}
          orderId={state.modal.order.id}
          onClose={onClose}
          onAction={onLoadOrder}
        />
      )}
    </section>
  );
};
