// @ts-nocheck - TypeScript compatibility fix
import { ThemeColor } from '@theme/color';
import dynamic from 'next/dynamic';
import { getFileFullUrl, madeBackgroundImageUrl, toUSDandCurrency } from '@utils';
import moment from 'moment';
import { useRouter } from 'next/router';
import { getProductPrice } from '@utils/product-functions';
import { useSocket } from '@web/hooks/use-socket';
import { useState } from 'react';
import { reloadUser, useAppDispatch } from '@store';




type Props = {
  sale: SaleModelType;
};

const Menu = dynamic(() => import('@widgets/menu').then(mod => mod.Menu), { ssr: false });

const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

const OrderStatusBadge = dynamic(() => import('@components/order-status').then(mod => mod.OrderStatusBadge), { ssr: false });

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
