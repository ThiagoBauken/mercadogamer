// @ts-nocheck - TypeScript compatibility fix

import dynamic from 'next/dynamic';
import { ThemeColor } from '@theme/color';
import { getFileFullUrl, madeBackgroundImageUrl, toUSDandCurrency } from '@utils';


import moment from 'moment';
import { useRouter } from 'next/router';
import { getProductPrice } from '@utils/product-functions';

type Props = {
  order: OrderModelType;
};

const OrderStatusBadge = dynamic(() => import('@components/order-status').then(mod => mod.OrderStatusBadge), { ssr: false });

const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

const Menu = dynamic(() => import('@widgets/menu').then(mod => mod.Menu), { ssr: false });

export const OrderDetailCard: React.FC<Props> = ({ order }) => {
  const router = useRouter();

  return (
    <div className="order-detail-card">
      <div
        className="image-container"
        style={{
          backgroundImage: madeBackgroundImageUrl(
            order?.product?.picture
              ? getFileFullUrl(order?.product?.picture)
              : '/assets/imgs/placeholder.png'
          ),
        }}
      ></div>

      <div className="label">{order?.product?.name}</div>

      <div className="action">
        <Menu
          activator={<Icon name="more-vertical" size={24} color={ThemeColor['gray-80']} />}
          menuItems={[
            {
              label: 'Detalle',
              action: () => router.push(`/dashboard/sale/${order.id}`),
            },
            // { label: 'Ver código' },
            { label: 'Finalizar transacción' },
            { label: 'Necesito ayuda' },
          ]}
        />
        {order?.hasUnreadMessage && <Icon name="mail" size={24} color={ThemeColor.primary} />}
      </div>

      <div></div>

      <div className="date-status">
        <div className="date">{moment(order?.createdAt).format('DD/MM/YYYY')}</div>
        <OrderStatusBadge status={order?.status} />
        <div className="price">{toUSDandCurrency(getProductPrice(order?.product))}</div>
      </div>
    </div>
  );
};
