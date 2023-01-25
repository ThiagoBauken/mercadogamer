import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { addMessageToToast, endpoints, get, setting } from '@utils';
import { ChatContainer, OrderDetail } from './widgets';
import { useTypedSelector } from '@store';
import moment from 'moment';
import { OrderStatusBadge } from '@components/order-status';
import { Button } from '@widgets/button';
import { Icon } from '@widgets/icon';
import { useSocket } from '../../../hooks/use-socket';

const ConfirmModal = dynamic(() => import('@components/confirm-modal/index'));
const ReportModal = dynamic(() => import('@components/report-modal/index'));
const RateUser = dynamic(() => import('@components/rate-user/index'));
const CancelModal = dynamic(() => import('../sale/widgets/cancel-modal/index'));

export const OrderDetailPageContent: React.FC = () => {
  const router = useRouter();

  const [id, setId] = useState<string>('');
  const { user } = useTypedSelector((store) => store.auth);

  const { socket } = useSocket();

  const [state, setState] = useState<{
    order: OrderModelType;
    userConversation: ConversationModelType;
    usersConversationMessages: MessageModelType[];
    adminConversation: ConversationModelType;
    adminConversationMessages: MessageModelType[];
    modal: { name: string };
  }>({
    order: {},
    userConversation: {},
    usersConversationMessages: [],
    adminConversation: {},
    adminConversationMessages: [],
    modal: { name: '' },
  });
  const [remainTime, setRemainTime] = useState<string>('');

  const [passTime, setPassTime] = useState<number>();

  useEffect(() => {
    const time = setInterval(() => {
      if (state.order?.createdAt) {
        const create = moment(state.order.createdAt);
        const expire = create.clone().add('days', 3);
        const now = moment();
        let duration: number = expire.diff(now);
        const pass = duration > 0 ? 1 : 0;
        setPassTime(pass);
        duration = Math.abs(duration);
        const days = Math.floor(duration / 86400000);
        duration -= days * 86400000;
        const hours = Math.floor(duration / 3600000);
        duration -= hours * 3600000;
        const minuts = Math.floor(duration / 60000);
        duration -= minuts * 60000;
        const seconds = Math.floor(duration / 1000);
        // const remainTime =
        //   pass > 0
        //     ? `Quedan ${days} días y ${hours}:${minuts} hr para que la transacción finalice automáticamente.`
        //     : `La hora en que se completa automáticamente la compra ha pasado la ${Math.abs(
        //         hours
        //       )}:${minuts} del día ${days}`;

        const remainTime =
          pass > 0
            ? ` ${days} días y ${hours}:${minuts}:${seconds}`
            : `${Math.abs(hours)}:${minuts}: del día ${days}`;
        setRemainTime(remainTime);
      }
    }, 500);

    return () => {
      clearInterval(time);
    };
  }, [state.order]);

  useEffect(() => {
    const { id } = router.query;
    setId(Array.isArray(id) ? id[0] : id);
  }, [router.isReady]);

  useEffect(() => {
    if (id) loadOrder();
  }, [id]);

  const isSeller = useMemo<boolean>(() => user?.id === state.order?.seller?.id, [state.order]);

  const descriptions = useMemo<{ [key: string]: string }>(
    () =>
      isSeller
        ? {
            pending: '',
            paid: 'Esta venta se encuentra en proceso. Una vez que el cliente finalice la transacción recibirás el dinero.',
            cancelled: 'Esta compra fue cancelada por el vendedor.',
            finished: 'Finalizó la transacción y recibiste el dinero.',
            returned: 'Esta compra posee un reclamo abierto.',
            complaint: 'Esta compra posee un reclamo abierto.',
          }
        : {
            pending: '',
            paid: 'Una vez que hayas verificado la validez del producto, por favor finalizá la transacción.',
            cancelled: 'Esta compra fue cancelada por el vendedor.',
            finished: 'Finalizó la transacción y el vendedor recibió el dinero.',
            returned: 'Esta compra posee un reclamo abierto.',
            complaint: 'Esta compra posee un reclamo abierto.',
          },
    [isSeller]
  );

  const loadOrder = async (modal?: { name: string }): Promise<void> => {
    try {
      if (id && typeof id === 'string') {
        const response = await get(`${endpoints.orderUrl}/chats/${id}`);
        setState({
          ...state,
          order: response.data?.data?.order || {},
          userConversation: response.data?.data?.usersConversation,
          usersConversationMessages: response.data?.data?.usersConversationMessages,
          adminConversation: response.data?.data?.adminConversation,
          adminConversationMessages: response.data?.data?.adminConversationMessages,
          ...(modal && { modal }),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onClose = (): void => setState({ ...state, modal: { name: '' } });

  const cancelOrder = (): void => {
    socket.emit(setting.socketEvents.cancelOrder, state.order.id);
    addMessageToToast('Se canceló la venta.', {
      status: 'error',
      icon: 'alert-triangle',
    });
    setState({
      ...state,
      modal: { name: '' },
    });
    loadOrder({ name: '' });
  };

  return (
    <section className="order-detail-page-content">
      <div className="title">
        {isSeller ? 'Venta' : 'Compra'}
        <span>#{state.order.number}</span>
      </div>
      <div className="content">
        <div className="status-chat">
          <div className="order-status">
            <div className="header">
              <div className="title">{`Estado de la ${isSeller ? 'venta' : 'compra'}`}</div>
              <OrderStatusBadge status={state.order.status} showBorder showIcon />
            </div>

            {['pending', 'paid', 'returned', 'complaint'].includes(state.order.status) && (
              <React.Fragment>
                {isSeller ? (
                  <>
                    <div className="seller-order-status">
                      <div className="counting-time">
                        {passTime > 0
                          ? 'Esta venta se finalizará automáticamente en:'
                          : 'Se acabó antes de la próxima vez.'}
                      </div>
                      <div className="auto-time">
                        <div className="icon">
                          <Icon name="clock" />
                        </div>
                        {remainTime}
                      </div>
                    </div>
                    <Button
                      kind="secondary"
                      onClick={() => setState({ ...state, modal: { name: 'cancel-modal' } })}
                    >
                      Cancelar venta
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="paid-status">
                      <div className="counting-time">
                        {passTime > 0
                          ? 'Finalizará automáticamente en:'
                          : 'Se acabó antes de la próxima vez:'}
                      </div>
                      <div className="auto-time">
                        <div className="icon">
                          <Icon name="clock" />
                        </div>
                        {remainTime}
                      </div>
                      <div className="alert">
                        Una vez que finalice la compra el vendedor recibirá el dinero de forma
                        irreversible.
                      </div>
                    </div>

                    <div className="action">
                      <Button
                        onClick={() => setState({ ...state, modal: { name: 'confirm-modal' } })}
                      >
                        Ya tengo el producto
                      </Button>

                      {state.order.status !== 'complaint' && (
                        <Button
                          kind="secondary"
                          onClick={() => setState({ ...state, modal: { name: 'report-modal' } })}
                        >
                          Tuve un problema
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </React.Fragment>
            )}

            <div className="message">{descriptions[state.order.status]}</div>
          </div>

          <ChatContainer
            orderId={state.order?.id}
            order={state.order}
            chatUser={
              user?.id === state.order.seller?.id ? state.order?.buyer : state.order?.seller
            }
            userConversation={state.userConversation}
            usersConversationMessages={state.usersConversationMessages}
            adminConversation={state.adminConversation}
            adminConversationMessages={state.adminConversationMessages}
            onChangeChart={loadOrder}
          />
        </div>

        <OrderDetail order={state.order} />
      </div>

      {state.modal.name === 'cancel-modal' && (
        <CancelModal
          open={state.modal.name === 'cancel-modal'}
          onClose={onClose}
          onAction={cancelOrder}
        />
      )}

      {state.modal.name === 'confirm-modal' && (
        <ConfirmModal
          open={state.modal.name === 'confirm-modal'}
          onAction={() => setState({ ...state, modal: { name: 'rate-user' } })}
          onClose={onClose}
        />
      )}

      {state.modal.name === 'report-modal' && (
        <ReportModal
          open={state.modal.name === 'report-modal'}
          orderId={state?.order?.id}
          onClose={() => loadOrder({ name: '' })}
        />
      )}

      {state.modal.name === 'rate-user' && (
        <RateUser
          open={state.modal.name === 'rate-user'}
          order={state.order}
          ratingUser={user.id === state.order.seller.id ? state.order.buyer : state.order.seller}
          rateContent={{
            order: state.order.id,
            qualified:
              state.order.seller.id === user.id ? state.order.buyer.id : state.order.seller.id,
            roleReviewed: state.order.seller.id === user.id ? 'user' : 'seller',
          }}
          onClose={() => loadOrder({ name: '' })}
        />
      )}
    </section>
  );
};
