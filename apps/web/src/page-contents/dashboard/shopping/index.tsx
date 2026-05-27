// @ts-nocheck - TypeScript compatibility fix
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

import moment from 'moment';
import { useRouter } from 'next/router';
import { useSocket } from '@web/hooks/use-socket';
import { BreakPoints } from '@theme/breakpoints';

import { ActionMenuItem } from '@ui-shared/components/action-menu-item';







import { useWindowSize } from '@hooks';
import { useTranslation } from 'next-i18next';

const ConfirmModal = dynamic(() => import('@components/confirm-modal/index'), { ssr: false });
const ReportModal = dynamic(() => import('../../../components/report-modal/index'), { ssr: false });
const RateUser = dynamic(() => import('@components/rate-user/index'), { ssr: false });


const OrderDetailCard = dynamic(() => import('./widgets').then(mod => mod.OrderDetailCard), { ssr: false });
const ShoppingCard = dynamic(() => import('./widgets').then(mod => mod.ShoppingCard), { ssr: false });

const Search = dynamic(() => import('@widgets/search').then(mod => mod.Search), { ssr: false });

const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

const OrderStatusBadge = dynamic(() => import('@components/order-status').then(mod => mod.OrderStatusBadge), { ssr: false });

const Menu = dynamic(() => import('@widgets/menu').then(mod => mod.Menu), { ssr: false });

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

const IconButton = dynamic(() => import('@widgets/icon-button').then(mod => mod.IconButton), { ssr: false });

const Expansion = dynamic(() => import('@widgets/expansion').then(mod => mod.Expansion), { ssr: false });

const Radiobox = dynamic(() => import('@widgets/radiobox').then(mod => mod.Radiobox), { ssr: false });

export const ShoppingContent: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation('dashboard');

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
        { label: t('shopping.status_options.all'), value: 'all' },
        { label: t('shopping.status_options.finished'), value: 'finished' },
        { label: t('shopping.status_options.pending'), value: 'pending' },
        { label: t('shopping.status_options.paid'), value: 'paid' },
        { label: t('shopping.status_options.complaint'), value: 'complaint' },
        { label: t('shopping.status_options.cancelled'), value: 'cancelled' },
      ],
      type: [
        { label: t('shopping.type_options.all'), value: 'all' },
        { label: t('shopping.type_options.game'), value: 'game' },
        { label: t('shopping.type_options.gift_card'), value: 'giftCard' },
        { label: t('shopping.type_options.item'), value: 'item' },
        { label: t('shopping.type_options.coins'), value: 'monedas' },
        { label: t('shopping.type_options.pack'), value: 'pack' },
      ],
      date: [
        { label: t('shopping.date_options.all'), value: 'all' },
        { label: t('shopping.date_options.this_month'), value: 'month' },
        { label: t('shopping.date_options.last_month'), value: 'before-month' },
        { label: t('shopping.date_options.this_year'), value: 'year' },
      ],
    }),
    [t]
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
        {t('shopping.title')}<span>{t('shopping.purchases_count', { count: state.orders?.data?.length || 0 })}</span>
      </div>

      <div className="shopping-info">
        <ShoppingCard
          title={t('shopping.cards.purchases_made')}
          value={finishedOrders.length}
          // image={getFileFullUrl(finishedOrders[finishedOrders.length - 1]?.product.picture)}
        />

        {width > BreakPoints.lg ? (
          <ShoppingCard
            title={t('shopping.cards.buyer_rating')}
            value={
              state.orders
                ? Math.round(state.orders?.data[0]?.buyer.sellerQualification * 100 || 0) / 100
                : 0.0
            }
          />
        ) : (
          <ShoppingCard
            title={t('shopping.cards.buyer_rating_short')}
            value={
              state.orders
                ? Math.round(state.orders?.data[0]?.buyer.sellerQualification * 100 || 0) / 100
                : 0.0
            }
          />
        )}

        <ShoppingCard
          title={t('shopping.cards.in_process')}
          value={state.orders?.data?.filter((item) => item.status == 'paid').length}
        />
      </div>
      <div className="content">
        <div className="header">
          <Search bgColor="transparent" placeholder={t('shopping.search_placeholder')} />
          <div className="action-menu">
            <ActionMenuItem
              label={t('shopping.filters_menu.status')}
              items={filters.state}
              value={state.filter.status}
              onChange={(value) =>
                setState({ ...state, filter: { ...state.filter, status: value } })
              }
            />

            <ActionMenuItem
              label={t('shopping.filters_menu.type')}
              items={filters.type}
              value={state.filter.type}
              onChange={(value) => setState({ ...state, filter: { ...state.filter, type: value } })}
            />

            <ActionMenuItem
              label={t('shopping.filters_menu.date')}
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
                  <th>{t('shopping.table.product')}</th>
                  <th style={{ width: '1px' }}></th>
                  <th>{t('shopping.table.status')}</th>
                  <th>{t('shopping.table.date')}</th>
                  <th>{t('shopping.table.price')}</th>
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
                                  label: t('shopping.actions.detail'),
                                  action: () => router.push(`/dashboard/order/${order.id}`),
                                },
                                // { label: t('shopping.actions.view_code') },
                                {
                                  label: t('shopping.actions.finish_transaction'),
                                  hide: ['finished', 'cancelled'].includes(order.status),
                                  action: () =>
                                    setState({
                                      ...state,
                                      modal: { name: 'confirm-modal', order: order },
                                    }),
                                },
                                {
                                  label: t('shopping.actions.had_problem'),
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
              {t('shopping.filters')}
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
                        <div className="label">{t('shopping.filters_menu.status')}</div>
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
                        <div className="label">{t('shopping.filters_menu.type')}</div>
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
                        <div className="label">{t('shopping.filters_menu.date')}</div>
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
