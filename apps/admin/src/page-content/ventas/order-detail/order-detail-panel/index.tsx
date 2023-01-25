import moment from 'moment';
import Image from 'next/image';
import {
  addMessageToToast,
  copyTextToClipboard,
  getFileFullUrl,
  toCurrency,
} from '../../../../../../../libs/ui-shared/src/utils';
import { Icon } from '../../../../../../../libs/ui-shared/src/widgets/icon';
import { ImageWithFallback } from '../../../../../../../libs/ui-shared/src/widgets/image-with-fallback';

interface IProps {
  order: OrderModelType;
}

export const OrderDetailPanel: React.FC<IProps> = ({ order }) => {
  const onCopy = async () => {
    try {
      if (order.stockProduct && order.stockProduct.code) {
        await copyTextToClipboard(order.stockProduct.code);
        addMessageToToast('Codigo copiado al portapapeles');
      }
    } catch (e) {
      addMessageToToast('Error al copiar al portapapeles', { status: 'error' });
    }
  };

  return (
    <div className="order-detail-panel">
      <div className="section product-detail">
        <h3>Detalle del producto</h3>
        <div>
          <div className="product-img-container">
            <ImageWithFallback
              alt="Product image"
              layout="fill"
              src={getFileFullUrl(order.product.picture)}
            />
          </div>
          <div className="product-info">
            <p>{order.product.name}</p>
            <div className="pricing-details">
              <span className="details-gray-text">
                {toCurrency(
                  (order.pricePaid || 0 + order.balanceUsed || 0 + order.giftUsed || 0).toFixed(2)
                )}
              </span>
              <Icon
                name={
                  order.stockProduct?.retirementType === 'automatic'
                    ? 'ent-inmediata'
                    : 'ent-coordinada'
                }
              />
            </div>
          </div>
        </div>
        {order.stockProduct?.retirementType === 'automatic' && (
          <div className="code">
            <div className="value">
              <span>{!Array.isArray(order?.stockProduct) && order?.stockProduct?.code}</span>
            </div>
            <div className="clipboard" onClick={onCopy}>
              <Icon size={24} color="black" name="clipboard" />
            </div>
          </div>
        )}
      </div>

      <hr />

      <div className="section payment-info">
        <h3>Detalle del pago</h3>
        <div className="payment-method">
          {order.paymentMethod === 'mercadoPago' ? (
            <>
              <Image src={'/assets/imgs/mercadopago.webp'} width={25} height={20} />
              <span className="details-gray-text payment-method-text">
                Realizado con MercadoPago
              </span>
            </>
          ) : (
            <>
              <Image src={'/assets/imgs/coins/many.webp'} width={10} height={10} />
              <span className="details-gray-text payment-method-text">Realizado con balance</span>
            </>
          )}
        </div>
        <div className="balance-used-info">
          <p>
            <span>Balance utilizado:</span> {toCurrency(order.balanceUsed.toFixed(2))}
          </p>
          <p>
            <span>Regalo utilizado:</span> {toCurrency(order.giftUsed.toFixed(2))}
          </p>
          <p>
            <span>Pagado:</span> {toCurrency(order.pricePaid.toFixed(2))}
          </p>
        </div>
        <div className="other-payment-info">
          <div className="text-with-icon">
            <Icon name="calendar" />
            <span className="details-gray-text">
              {moment(order.createdAt).format('DD/MM/YYYY')}
            </span>
          </div>
          <div className="text-with-icon">
            <Icon name="file-text" />
            <span className="details-gray-text">{order.paymentId || 'N/A'}</span>
          </div>
        </div>
      </div>

      <hr />

      <div className="section buy-info">
        <h3>Detalle de la compra</h3>
        <div className="text-with-icon">
          <Icon name="calendar" />
          <span className="details-gray-text">
            Realizado el {moment(order.createdAt).format('DD/MM/YYYY')}
          </span>
        </div>
        <div className="text-with-icon">
          <Icon name="file-text" />
          <span className="details-gray-text">#{order.number}</span>
        </div>
      </div>
    </div>
  );
};
