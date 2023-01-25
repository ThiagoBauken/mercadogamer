import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { endpoints, get, getFileFullUrl } from '../../../../../../libs/ui-shared/src/utils';
import { OrderStatusBadge } from '@ui-shared/components/order-status-badge';
import { Button } from '../../../../../../libs/ui-shared/src/widgets/button';
import { Icon } from '../../../../../../libs/ui-shared/src/widgets/icon';
import { orderUrl } from '../../../../../../libs/ui-shared/src/utils/endpoints';
import Image from 'next/image';
import moment from 'moment';
import WithDrawlsApproveModal from '@admin/components/withdrawls-approve';
import WithDrawlsRejectModal from '@admin/components/withdrawls-reject';

export const LoadsExpandedView: React.FC = () => {
  const router = useRouter();

  const [state, setState] = useState<{
    approvemodal: boolean;
    rejectmodal: boolean;
  }>({
    approvemodal: null,
    rejectmodal: null,
  });

  const [withdrawal, setLoads] = useState<AdminWithDrawalModelType>(undefined);

  useEffect(() => {
    init();
  }, [router.query.id]);

  const init = async () => {
    const id = router.query.id;

    if (id) {
      const { data } = await get(`${endpoints.withdrawalUrl}/${id}`, {
        _populates: ['user', 'paymentMethod', { path: 'user', populate: 'country' }],
      });

      setLoads(data.data);
      // console.log(data);
    }
  };

  const loadApproveModal = async (): Promise<void> => {
    try {
      // const response = await httpGetAll<TicketModelType>(endpoints.ticketUrl, {
      //   filter: { user: user.id },
      //   sort: { updatedAt: -1 },
      // });
      setState({ ...state, approvemodal: false });
    } catch (error) {
      console.log(error);
    }
  };

  const Content = () => {
    return (
      <>
        <div className="load-detail-header">
          <h1 className="load-detail-title">Carga</h1>
          <div className="action-group">
            <Button kind="primary" onClick={() => setState({ ...state, approvemodal: true })}>
              Aprobar
            </Button>
            <Button kind="secondary" onClick={() => setState({ ...state, rejectmodal: true })}>
              Rechazar
            </Button>
          </div>
        </div>
        <div className="load-details-cards-container">
          <div className="sm-title">
            <div className="title">Detalle del movimiento</div>
            <div className="status">
              {withdrawal.status === 'paid' ? (
                <div className="paid">
                  <Icon name="check-circle"></Icon>Realizado
                </div>
              ) : (
                <div className="pending">
                  <Icon name="clock"></Icon>En proceso
                </div>
              )}

              {/* <OrderStatusBadge status={withdrawal.status} showBorder showIcon /> */}
            </div>
          </div>
          <div className="price">${withdrawal.amount}</div>
          <div className="user">
            <div className="photo">
              <Image
                src={getFileFullUrl(withdrawal.user?.picture)}
                className="icon"
                width={30}
                height={30}
                loading="lazy"
                unoptimized={true}
                alt="device card"
              />
            </div>
            <div className="name">{withdrawal.user?.username}</div>
          </div>
          <div className="detail">
            <div className="item">
              <Icon name="loads-calender"></Icon>Realizado:
              {moment(withdrawal.createdAt).format('DD/MM/YYYY')}
            </div>
            <div className="item">
              <Icon name="dollar"></Icon>Medio de pago:
              {withdrawal.paymentMethod.type}
            </div>
            <div className="item">
              <Icon name="loads-user"></Icon>Nombre: {withdrawal.user?.firstName}{' '}
              {withdrawal.user?.lastName}
            </div>
            <div className="item">
              <Icon name="banks"></Icon>Banco: {withdrawal.paymentMethod.type}
            </div>
            <div className="item">
              <Icon name="banks"></Icon>CBU: {withdrawal.taxId}
            </div>
            <div className="item">
              <Icon name="documents"></Icon>ID de retiro: #{withdrawal.id}
            </div>
            <div className="item">
              <Icon name="dollar"></Icon>Moneda: {withdrawal.user?.country.currency}
            </div>
            <div className="item">
              <Icon name="map"></Icon>Dirección de facturación: {withdrawal.user?.address}
            </div>
          </div>
        </div>
        {withdrawal.status !== 'pending' && (
          <div className="load-details-explain">
            <div className="title">Comentario</div>
            <div className="content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation.
            </div>
          </div>
        )}
        {state.approvemodal && (
          <WithDrawlsApproveModal
            open={true}
            onClose={() => setState({ ...state, approvemodal: false })}
            onAction={loadApproveModal}
          />
        )}
        {state.rejectmodal && (
          <WithDrawlsRejectModal
            open={true}
            onClose={() => setState({ ...state, rejectmodal: false })}
            onAction={loadApproveModal}
          />
        )}
      </>
    );
  };

  return <div className="load-detail-content">{withdrawal && <Content />}</div>;
};
