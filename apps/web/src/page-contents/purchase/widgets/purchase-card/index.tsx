import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  getFileFullUrl,
  madeBackgroundImageUrl,
  toUSDandCurrency,
  copyTextToClipboard,
  addMessageToToast,
} from '@utils';
import { useTypedSelector } from '@store';
import { Menu } from '@widgets/menu';
import { Icon } from '@widgets/icon';
import { Button } from '@widgets/button';
import { useRouter } from 'next/router';

const ConfirmModal = dynamic(() => import('@components/confirm-modal/index'));
const ReportModal = dynamic(() => import('@components/report-modal/index'));
const RateUser = dynamic(() => import('@components/rate-user/index'));

type Props = {
  order: OrderModelType;
  onReload: () => void;
};
export const PurchaseCard: React.FC<Props> = ({ order, onReload }) => {
  const router = useRouter();

  const { user = {} } = useTypedSelector((store) => store.auth);

  const [state, setState] = useState<{
    edit: boolean;
    modal: {
      name: '' | 'confirm-modal' | 'report-modal' | 'rate-user';
    };
  }>({
    edit: false,
    modal: {
      name: '',
    },
  });

  const onClose = (): void => {
    setState({ ...state, modal: { name: '' } });
  };

  const onCopy = (): void => {
    order?.order?.stockProduct?.code &&
      copyTextToClipboard(order?.order?.stockProduct?.code).then(() => {
        addMessageToToast('¡Éxito copiado!');
      });
  };

  return (
    <div className="purchase-card">
      <div className="detail-menu">
        <Menu
          activator={<Icon name="more-vertical" />}
          menuItems={[
            {
              label: 'Tengo un problema',
              action: () => setState({ ...state, modal: { name: 'report-modal' } }),
            },
            {
              label: 'Ver detalles',
              action: () => router.push(`dashboard/order/${order.order.id}`),
            },
            {
              label: '¿Cómo usar este código?',
              action: () => router.push(`/help-center/buy/5`),
              hide: order.stockProduct?.retirementType !== 'automatic',
            },
          ]}
        />
      </div>
      <div className="main">
        <div className="product">
          <div
            className="image-container"
            style={{
              backgroundImage: madeBackgroundImageUrl(
                getFileFullUrl(order.order.product?.picture),
                '/assets/imgs/placeholder.svg'
              ),
            }}
          ></div>

          <div className="content">
            <div className="title">{order.order?.product?.name}</div>
            <div className="info">
              <div className="delivery">
                <Icon
                  name={
                    order.order?.stockProduct?.retirementType === 'automatic'
                      ? 'ent-inmediata'
                      : 'ent-coordinada'
                  }
                />
              </div>
              <div className="label">
                {order.order?.stockProduct?.retirementType === 'automatic'
                  ? 'Entrega automática'
                  : 'Entrega coordinada'}
              </div>
              <div className="price">{toUSDandCurrency(order.order.product?.price)}</div>
            </div>
          </div>
        </div>

        <div className="action">
          {(order.order.status === 'finished' || order.order.status === 'paid') &&
          order.order?.stockProduct?.retirementType === 'automatic' ? (
            <Button
              kind="secondary"
              width={215}
              onClick={() => setState({ ...state, edit: true })}
              disabled={state.edit}
            >
              Obtener código
            </Button>
          ) : (
            <div className="chat-description">
              El vendedor se pondrá en contacto contigo a la brevedad.{' '}
              <span onClick={() => router.push(`dashboard/order/${order.order.id}`)}>
                Ir al chat
              </span>
            </div>
          )}
        </div>
      </div>

      {state.edit && (order.order.status === 'paid' || order.order.status === 'finished') ? (
        <div className="edit-content">
          <div className="code">
            <div className="value">{order.order?.stockProduct?.code}</div>
            <div className="clipboard" onClick={onCopy}>
              <Icon name="clipboard" />
            </div>
          </div>
          {order.order.status === 'paid' && (
            <>
              <div className="confirm-code">
                <div className="message">¿Funcionó el código?</div>
                <div
                  className="action yes"
                  onClick={() => setState({ ...state, modal: { name: 'confirm-modal' } })}
                >
                  Sí
                </div>
                <div
                  className="action no"
                  onClick={() => setState({ ...state, modal: { name: 'report-modal' } })}
                >
                  No
                </div>
              </div>
              <div className="notification">
                <div className="icon">
                  <Icon name="alert-triangle" />
                </div>
                <div className="message">
                  Recuerda que tienes un plazo máximo de 3 días para verificar la validez del
                  producto.
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div></div>
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
          orderId={order.order.id}
          onAction={() => router.push(`dashboard/order/${order.order.id}`)}
          onClose={onClose}
        />
      )}

      {state.modal.name === 'rate-user' && (
        <RateUser
          open={state.modal.name === 'rate-user'}
          order={order}
          ratingUser={
            user.id === order?.order.seller?.id ? order?.order?.buyer : order?.order?.seller
          }
          rateContent={{
            order: order?.order.id,
            qualified:
              order?.order?.seller?.id === user.id
                ? order?.order?.buyer?.id
                : order?.order?.seller?.id,
            roleReviewed: order?.order?.seller?.id === user.id ? 'user' : 'seller',
          }}
          onClose={onClose}
          onAction={onReload}
        />
      )}
    </div>
  );
};
