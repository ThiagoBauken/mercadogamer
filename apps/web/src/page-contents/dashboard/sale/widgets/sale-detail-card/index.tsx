import { ThemeColor } from '@theme/color';
import { getFileFullUrl, madeBackgroundImageUrl, toUSDandCurrency } from '@utils';
import moment from 'moment';
import { useRouter } from 'next/router';
import { getProductPrice } from '@utils/product-functions';
import { useSocket } from '@web/hooks/use-socket';
import { useState } from 'react';
import { reloadUser, useAppDispatch } from '@store';
import { Menu } from '@widgets/menu';
import { Icon } from '@widgets/icon';
import { OrderStatusBadge } from '@components/order-status';

type Props = {
  sale: SaleModelType;
};
export const SaleDetailCard: React.FC<Props> = ({ sale }) => {
  const router = useRouter();
  const { socket } = useSocket();
  const dispatch = useAppDispatch();

  const [state, setState] = useState<{ loading: boolean; rate: number; opinion: string }>({
    loading: false,
    rate: 0,
    opinion: '',
  });

  // const CancelOrder = async (id): Promise<void> => {
  //   socket.emit(setting.socketEvents.cancelOrder, id);
  //   addMessageToToast('La venta ha sido cancelada.', {
  //     status: 'error',
  //     icon: 'alert-triangle',
  //   });
  //   setState({ ...state, loading: false });
  //   dispatch(reloadUser());
  // };

  return (
    <div className="sale-detail-card">
      <div
        className="image-container"
        style={{
          backgroundImage: madeBackgroundImageUrl(
            sale?.product?.picture
              ? getFileFullUrl(sale?.product?.picture)
              : '/assets/imgs/placeholder.png'
          ),
        }}
      ></div>

      <div className="label">
        <span className="sale-number">#{sale?.number}</span>&nbsp;||&nbsp;
        <span>{sale?.product?.name}</span>
      </div>

      <div className="action">
        <Menu
          activator={<Icon name="more-vertical" size={24} color={ThemeColor['gray-80']} />}
          menuItems={[
            {
              label: 'Ver detalle',
              action: () => router.push(`/dashboard/order/${sale.id}`),
            },
            // { label: 'Ver código' },
            { label: 'Descargar' },
            {
              label: 'Cancelar venta',
              color: ThemeColor.negative,
              // action: () => CancelOrder(sale.id),
            },
          ]}
        />
        {sale?.hasUnreadMessage && <Icon name="mail" size={24} color={ThemeColor.primary} />}
      </div>

      <div></div>

      <div className="date-status">
        <div className="date">{moment(sale?.createdAt).format('DD/MM/YYYY')}</div>
        <OrderStatusBadge status={sale?.status} />
        <div className="price">{toUSDandCurrency(getProductPrice(sale?.product))}</div>
      </div>
    </div>
  );
};
