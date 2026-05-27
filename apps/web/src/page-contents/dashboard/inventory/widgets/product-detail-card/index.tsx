// @ts-nocheck - TypeScript compatibility fix
import React from 'react';
import dynamic from 'next/dynamic';
import { ThemeColor } from '@theme/color';
import { getFileFullUrl, madeBackgroundImageUrl, toUSDandCurrency } from '@utils';
import moment from 'moment';
import { useRouter } from 'next/router';
import { getProductPrice, ProductStatusCardInfo } from '@utils/product-functions';




type Props = {
  product: ProductModelType;
  onDelete: () => void;
};

const Menu = dynamic(() => import('@widgets/menu').then(mod => mod.Menu), { ssr: false });

const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

const StatusCard = dynamic(() => import('@widgets/status-card').then(mod => mod.StatusCard), { ssr: false });

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

