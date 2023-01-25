import React, { useMemo } from 'react';
import moment from 'moment';
import { useTypedSelector } from '@store';
import {
  addMessageToToast,
  copyTextToClipboard,
  getFileFullUrl,
  madeBackgroundImageUrl,
  ProductFunctions,
  toUSD,
} from '@utils';
import { Icon } from '@widgets/icon';

type Props = {
  order: OrderModelType;
};

export const OrderDetail: React.FC<Props> = ({ order }) => {
  const { user } = useTypedSelector((store) => store.auth);

  const onCopy = (): void => {
    order?.stockProduct?.code &&
      copyTextToClipboard(order?.stockProduct?.code).then(() => {
        addMessageToToast('¡Éxito copiado!');
      });
  };
  const isSeller = useMemo<boolean>(() => user?.id === order?.seller?.id, [order]);

  return (
    <div className="order-detail">
      <div className="title">Detalle del producto</div>
      <div className="product">
        <div className="information">
          <div
            className="image-container"
            style={{
              backgroundImage: madeBackgroundImageUrl(
                getFileFullUrl(order?.product?.picture)
              ),
            }}
          ></div>
          <div className="content">
            <div className="name">{order?.product?.name}</div>
            <div className="price-delivery">
              <div className="price">{`$${
                order?.productPrice?.toFixed(2) || toUSD(order?.product?.price)
              }`}</div>
              <div className="delivery">
                <Icon
                  name={
                    order?.stockProduct?.retirementType === 'automatic'
                      ? 'ent-inmediata'
                      : 'ent-coordinada'
                  }
                />
              </div>
            </div>
          </div>
        </div>
        {order?.stockProduct?.retirementType === 'automatic'? (
          <div className="code">
            <div className="value">
              {!Array.isArray(order?.stockProduct) && order?.stockProduct?.code}
            </div>
            <div className="clipboard" onClick={onCopy}>
              <Icon name="clipboard" />
            </div>
          </div>
        ): <div></div>}
      </div>

      {!isSeller && (
        <React.Fragment>
          <div className="divition"></div>
          <div className="detail-payment section">
            <div className="title">Detalle del pago</div>
            <div className="payment">
              <div className="icon">
                <Icon name="payment-logo" />
              </div>
              Realizado por MercadoPago
            </div>

            <div className="info">
              <div className="item">
                <div className="icon">
                  <Icon name="file-text" />
                </div>
                <div className="label">{`#${order?.id}`}</div>
              </div>
              <div className="item">
                <div className="icon">
                  <Icon name="calendar" />
                </div>
                <div className="label">{moment(order.createdAt).format('DD/MM/YYYY')}</div>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}

      <div className="divition"></div>

      <div className="section detail-order">
        <div className="title">{`Detalle de la ${isSeller ? 'venta' : 'compra'}`}</div>
        <div className="update-time item">
          <div className="icon">
            <Icon name="calendar" />
          </div>
          <div className="message">{`Realizado: ${moment(order.updatedAt).format(
            'DD/MM/YYYY'
          )}`}</div>
        </div>
        <div className="update-time item">
          <div className="icon">
            <Icon name="file-text" />
          </div>
          <div className="message">{`Nro de compra: #${order?.number}`}</div>
        </div>
        {isSeller ? (
          <div className="buyer item">
            <div className="icon">
              <Icon name="user" />
            </div>
            <div className="message">
              Comprador: <span>{order?.buyer?.username}</span>
            </div>
          </div>
        ): 
        (<div className="buyer item">
            <div className="icon">
              <Icon name="user" />
            </div>
            <div className="message">
              Vendedor: <span>{order?.seller?.username}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
