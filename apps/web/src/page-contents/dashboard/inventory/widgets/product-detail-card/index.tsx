import React from 'react';
import { ThemeColor } from '@theme/color';
import { getFileFullUrl, madeBackgroundImageUrl, toUSDandCurrency } from '@utils';
import moment from 'moment';
import { useRouter } from 'next/router';
import { getProductPrice, ProductStatusCardInfo } from '@utils/product-functions';
import { Menu } from '@widgets/menu';
import { Icon } from '@widgets/icon';
import { StatusCard } from '@widgets/status-card';

type Props = {
  product: ProductModelType;
  onDelete: () => void;
};
export const ProductDetailCard: React.FC<Props> = ({ product, onDelete }) => {
  const router = useRouter();

  return (
    <div className="product-detail-card">
      <div
        className="image-container"
        style={{
          backgroundImage: madeBackgroundImageUrl(
            product?.picture ? getFileFullUrl(product?.picture) : '/assets/imgs/placeholder.svg',
            '/assets/imgs/placeholder.svg'
          ),
        }}
      ></div>

      <div className="label">{product?.name}</div>

      <div className="action">
        <Menu
          activator={<Icon name="more-vertical" size={24} color={ThemeColor['gray-80']} />}
          menuItems={[
            {
              label: 'Ver publicación',
              action: () => router.push(`/product-detail/${product.id}`),
            },
            { label: 'Editar', action: () => router.push(`inventory/edit/${product.id}`) },
            // { label: 'Pausar' },
            { label: 'Eliminar', color: ThemeColor.negative,
            action: onDelete
          },
          ]}
        />
      </div>

      <div></div>

      <div className="date-status">
        <div className="date">{moment(product?.createdAt).format('DD/MM/YYYY')}</div>
        <StatusCard color={ProductStatusCardInfo[product.status]?.color}>
          {ProductStatusCardInfo[product?.status]?.label}
        </StatusCard>
        <div className="price">{toUSDandCurrency(getProductPrice(product))}</div>
      </div>
    </div>
  ); 
};

