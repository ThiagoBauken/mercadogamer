import { getNotifications } from '@actions/notification';
import { openLoginModal, useAppDispatch, useTypedSelector } from '@store';
import { endpoints, madeBackgroundImageUrl, put } from '@utils';
import { NotificationInformation } from '@utils/notification';
import { Icon } from '@widgets/icon';
import { Menu } from '@widgets/menu';
import { useRouter } from 'next/router';
import { useState } from 'react';

export const NotificationMenu: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [openNotification, setNotification] = useState<boolean>(false);
  const {
    auth: { user },
    notification: { notifications },
  } = useTypedSelector((store) => store);

  const onClickNotification = (notification: NotificationModelType): void => {
    if (!notification) return;
    put(`${endpoints.notificationUrl}/${notification.id}`, { new: false }).then(() => {
      dispatch(getNotifications());
    });

    switch (notification.action) {
      case 'ClaimReceive':
        router.push(`/dashboard/sale`);
        break;
      case 'receiveSuccess':
        router.push(`/dashboard/sale/${notification.payload?.id}`);
        break;
      case 'purchaseSuccess':
        router.push(`/dashboard/order/${notification.payload?.id}`);
        break;
      case 'productPaid':
        router.push(`/dashboard/order/${notification.payload?.id}`);
        break;
      case 'productAccepted':
        router.push(`/dashboard/inventory`);
        break;
      case 'productRejected':
        router.push(`/dashboard/inventory`);
        break;
      case 'answer':
        router.push('/dashboard/qas');
        break;
      case 'question':
        router.push('/dashboard/question');
        break;
    }
  };

  const allViewNotification = async (): Promise<void> => {
    for (const notification of notifications.filter((notification) => notification.new)) {
      await put(`${endpoints.notificationUrl}/${notification.id}`, { new: false });
    }
    await dispatch(getNotifications());
  };

  const loginModal = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (!user) {
      event.stopPropagation();
      dispatch(openLoginModal(''));
    }
  };

  return (
    <Menu
      maxHeight="unset"
      open={openNotification}
      onChangeOpen={(val) => setNotification(val)}
      activator={
        <div className="notification badge-container" onClick={loginModal}>
          <Icon name="bell" />
          {notifications.filter((item) => item.new)?.length ? <div className="badge"></div> : null}
        </div>
      }
    >
      <div className="notification-container">
        <div className="header">
          <div className="left-direction" onClick={() => setNotification(false)}>
            <Icon name="left-direction"></Icon>
            <div>Notificaciones</div>
          </div>
        </div>
        <ul className="content">
          {notifications.filter((notification) => notification.new).length ? (
            notifications
              .filter((notification) => notification.new)
              .map((notification) => (
                <li key={notification.id} onClick={() => onClickNotification(notification)}>
                  <div
                    className="icon"
                    style={{ color: NotificationInformation[notification.action]?.color }}
                  >
                    <Icon name={NotificationInformation[notification.action]?.icon} />
                  </div>
                  <div className="content">
                    <div className="title">{notification.title}</div>
                    <div className="description">{notification.description}</div>
                  </div>
                  <div className={`status${notification.new ? ' active' : ''}`}></div>
                </li>
              ))
          ) : (
            <li className="not-have-content">
              <div
                className="image-container"
                style={{
                  backgroundImage: madeBackgroundImageUrl('/assets/imgs/no-notification.webp'),
                }}
              ></div>
              <div className="message">Por ahora no hay notificaciones.</div>
            </li>
          )}
        </ul>
        {!!notifications.filter((notification) => notification.new).length && (
          <div className="view">
            <div className="content" onClick={() => allViewNotification()}>
              Marcar todas como leídas
            </div>
          </div>
        )}
      </div>
    </Menu>
  );
};
