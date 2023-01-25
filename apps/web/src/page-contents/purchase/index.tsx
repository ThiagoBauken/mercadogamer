import { useSocket } from '@web/hooks/use-socket';
import { useTypedSelector } from '@store';
import { endpoints, httpGetAll, setting } from '@utils';
import { useEffect, useState } from 'react';
import { PurchaseCard } from './widgets';
import { Icon } from '@widgets/icon';

export const PurchaseContent: React.FC = () => {
  const {
    auth: { user },
  } = useTypedSelector((store) => store);

  const { socket } = useSocket();

  const [state, setState] = useState<{
    orders: OrderModelType[];
  }>({
    orders: [],
  });

  const [initMode, setInitMode] = useState<number>(0);

  useEffect(() => {
    const closeSocket = (): void => {
      socket?.off(setting.socketEvents.orderClaimed);
      socket?.off(setting.socketEvents.finishOrder);
    };

    if (socket) {
      closeSocket();
      socket.on(setting.socketEvents.orderClaimed, () => {
        setInitMode(Date.now());
      });

      socket.on(setting.socketEvents.finishOrder, () => {
        setInitMode(Date.now());
      });
    }

    return closeSocket;
  }, [socket, user?.id]);

  useEffect(() => {
    user?.id && init();
  }, [user]);

  useEffect(() => {
    initMode && init();
  }, [initMode]);

  const init = async (): Promise<void> => {
    try {
      const result = await httpGetAll(endpoints.orderIdUrl, {
        filter: { user: user.id },
        populate: [{ path: 'order', populate: ['product', 'seller', 'buyer', 'stockProduct'] }],
        sort: { updatedAt: -1 },
      });

      setState({ orders: result.data?.data });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className="purchase-page-content">
      <div className="header">
        <div className="image-container"></div>
        <div className="title">Gracias por tu compra.</div>
        <div className="description">Aquí están tus productos.</div>
      </div>
      <div className="content">
        {state.orders
          .filter((item) => item.order.status == 'paid' || 'finished')
          .map((order) => (
            <PurchaseCard order={order} key={order.id} onReload={() => init()} />
          ))}
      </div>
      <div className="explain">
        <div>
          <div className="icon">
            <Icon name="alert-triangle" />
          </div>
          <div className="content">
            <div className="title">
              Recordá que tenés un plazo máximo de 3 días para hacer un reclamo
            </div>
            <div className="description">
              Si no recibís tu producto, el vendedor no contesta o estas teniendo algún problema,
              por favor abrí un reclamo clickeando en "Tengo un problema".
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
