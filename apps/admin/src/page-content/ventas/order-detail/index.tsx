import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  addMessageToToast,
  endpoints,
  get,
  put,
  setting,
} from '../../../../../../libs/ui-shared/src/utils';
import { OrderStatusBadge } from '@ui-shared/components/order-status-badge';
import { OrderDetailPanel } from './order-detail-panel';
import { Chat } from './chat';
import { useSocket } from '../../../hooks/use-socket';
import { Button } from '../../../../../../libs/ui-shared/src/widgets/button';
import { Icon } from '../../../../../../libs/ui-shared/src/widgets/icon';
import { orderUrl } from '../../../../../../libs/ui-shared/src/utils/endpoints';

enum ChatsTypes {
  BUYER = 'buyer',
  SELLER = 'seller',
  USERS = 'users',
}

export const OrderExpandedView: React.FC = () => {
  const router = useRouter();

  const { socket } = useSocket();

  const [selectedChat, setSelectedChat] = useState<ChatsTypes>(ChatsTypes.BUYER);
  const [order, setOrder] = useState<OrderModelType>(undefined);
  const [chatData, setChatData] = useState<{
    usersConversation: ConversationModelType;
    sellerConversation: ConversationModelType;
    buyerConversation: ConversationModelType;
    usersConversationMessages: MessageModelType[];
    sellerConversationMessages: MessageModelType[];
    buyerConversationMessages: MessageModelType[];
  }>({
    usersConversation: {},
    sellerConversation: {},
    buyerConversation: {},
    usersConversationMessages: [],
    sellerConversationMessages: [],
    buyerConversationMessages: [],
  });

  useEffect(() => {
    init();
  }, [router.query.id]);

  const init = async () => {
    const id = router.query.id;

    if (id) {
      const { data } = await get(`${endpoints.orderUrl}/chats/${id}`);
      setOrder(data.data.order);
      const obj = {
        ...chatData,
        usersConversation: data.data.usersConversation,
        sellerConversation: data.data.sellerConversation,
        buyerConversation: data.data.buyerConversation,
        usersConversationMessages: data.data.usersConversationMessages,
        sellerConversationMessages: data.data.sellerConversationMessages,
        buyerConversationMessages: data.data.buyerConversationMessages,
      };
      setChatData(obj);
    }
  };

  const addNewMessage = (msg: MessageModelType) => {
    switch (msg.conversation) {
      case chatData.usersConversation.id:
        setChatData({
          ...chatData,
          usersConversationMessages: [...chatData.usersConversationMessages, msg],
        });
        break;

      case chatData.buyerConversation.id:
        setChatData({
          ...chatData,
          buyerConversationMessages: [...chatData.buyerConversationMessages, msg],
        });
        break;

      case chatData.sellerConversation.id:
        setChatData({
          ...chatData,
          sellerConversationMessages: [...chatData.sellerConversationMessages, msg],
        });
        break;
    }
  };

  const finishOrder = () => {
    socket.emit(setting.socketEvents.finishOrder, {
      info: 'finishedByAdmin',
      order: order.id,
    });

    setOrder({
      ...order,
      status: 'finished',
    });
  };

  const cancelOrder = () => {
    socket.emit(setting.socketEvents.cancelOrder, order.id);

    setOrder({
      ...order,
      status: 'cancelled',
    });
  };

  const markAsReimbured = async () => {
    const id = order.id;

    try {
      await put(orderUrl + '/' + id, {
        reimbursed: true,
      });

      setOrder({
        ...order,
        reimbursed: true,
      });
      addMessageToToast('Orden ' + id + ' marcada como reembolsada');
    } catch (e) {
      addMessageToToast('Error al marcar la order ' + id + ' como reembolsada', {
        status: 'error',
      });
      console.error(e);
    }
  };

  const Content = () => {
    return (
      <>
        <h1 className="order-detail-title">
          Orden <span>#{order.number}</span>
        </h1>
        <div className="order-details-cards-container">
          <div>
            <div className="general-detail-card">
              <div className="title-and-badge">
                <div>
                  <h2>Estado de la orden</h2>
                </div>
                <div className="status-badge-container">
                  <OrderStatusBadge status={order.status} showBorder showIcon />
                </div>
              </div>
              {order.status !== 'finished' && order.status !== 'cancelled' && (
                <div className="buttons">
                  <Button onClick={finishOrder}>Finalizar transaccion</Button>
                  <Button kind="secondary" onClick={cancelOrder}>
                    Cancelar compra
                  </Button>
                </div>
              )}
              {order.status === 'cancelled' &&
                !order.reimbursed &&
                order.paymentMethod === 'mercadoPago' && (
                  <Button onClick={markAsReimbured}>Marcar como reembolsada</Button>
                )}

              {order.reimbursed && order.status === 'cancelled' && (
                <div className="reimbursed-confirmation">
                  <Icon name="check-circle" color="green" size={32} />
                  <span>Orden marcada como reembolsada</span>
                </div>
              )}
            </div>
            <Chat
              order={order}
              socket={socket}
              addNewMessage={addNewMessage}
              selectedChat={selectedChat}
              setSelected={setSelectedChat}
              {...chatData}
            />
          </div>
          <OrderDetailPanel order={order} />
        </div>
      </>
    );
  };

  return <div className="order-detail-content">{order && <Content />}</div>;
};
