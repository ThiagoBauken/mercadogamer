import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  getCarts,
  logout,
  openLoginModal,
  openSignupModal,
  reloadUser,
  useAppDispatch,
  useTypedSelector,
} from '@store';
import { getFileFullUrl, setting, toCurrency } from '@utils';
import { MobileNavigation } from '../mobile-nav';
import { Icon } from '@widgets/icon';
import { Search } from '@widgets/search';
import { Menu } from '@widgets/menu';
import { Button } from '@widgets/button';
import { useSocket } from '@web/hooks/use-socket';
import { CART } from '@action-types';
import { onReceivedNotification } from '@actions/notification';
import { NotificationMenu } from '@components/notification-menu';
import { CartMenu } from '@components/cart-menu';
import Image from 'next/image';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { socket } = useSocket();
  const {
    auth: { user },
    catalog: { filter },
    referredby,
  } = useTypedSelector((store) => store);

  const [collapse, setCollapse] = useState<boolean>(false);

  const [search, setSearch] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [localUser, setLocalUser] = useState();

  const router = useRouter();

  const navItems: NavItem[] = [
    {
      label: 'Catálogo',
      url: '/catalogo',
      icon: 'shopping-bag',
      role: 'default',
    },
    {
      label: 'Regalos',
      url: '/regalos',
      icon: 'gift',
      role: 'default',
    },
    {
      label: 'Vender',
      url: user?.hasFirstVisitVendor ? '/dashboard/inventory/add' : '/vendedores',
      icon: 'dollar-circle',
      role: 'default',
    },
    // {
    //   label: 'Novedades',
    //   url: '/news',
    // },
  ];

  const goPage = (item: NavItem) => (): void => {
    if (router.asPath.includes(item.url)) return;
    router.push(item.url);
  };

  useEffect(() => {
    if (socket && user?.id && socket.connected) {
      socket.off(setting.socketEvents.checkHasCarts);
      socket.off(setting.socketEvents.notification);

      socket.emit(setting.socketEvents.checkHasCarts, user.id);

      socket.on(setting.socketEvents.checkHasCarts, (value: boolean): void => {
        dispatch({ type: CART.SET_VALUE, payload: { hasCarts: value } });
        dispatch(getCarts());
      });
      dispatch(reloadUser());
      socket.on(setting.socketEvents.notification, (value: NotificationModelType): void => {
        dispatch(onReceivedNotification(value));
      });
    }
  }, [socket?.connected, user?.id]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const search = params.get('busqueda');
    setSearchValue(search);

    if (!user && referredby.referredby) {
      dispatch(openSignupModal());
    }
  }, [router.isReady, router.query]);

  const getMenuItemClass = (item: NavItem): string => {
    const classes = ['menu-item'];
    router.asPath.includes(item.url) && classes.push('active');
    return classes.join(' ');
  };

  const onSearch = (event) => {
    const { key } = event;
    if (key === 'Enter') {
      const { value } = event.target;
      const params = new URLSearchParams(window.location.search);

      if (value) {
        params.set('busqueda', value);
        router.push('/catalogo?' + params.toString());
      } else {
        router.push('/catalogo');
      }
    }
  };

  return (
    <header className="mercado-default-layout-header">
      <div className="menu-action" onClick={() => setCollapse(!collapse)}>
        {user ? (
          <div
            className="avatar"
            style={{
              backgroundImage: `url('${getFileFullUrl(
                user.picture
              )}'), url('/assets/imgs/avatar.webp')`,
            }}
          ></div>
        ) : (
          <Icon name="menu" />
        )}
      </div>

      <div className="logo" onClick={() => router.push('/')}>
        <Icon name="logo" />
      </div>

      <MobileNavigation collapse={collapse} onChangeStatus={setCollapse} />

      <div className={`search-container${search ? ' active' : ''}`}>
        <Search placeholder="Buscar en Mercado Gamer" value={searchValue} onKeyup={onSearch} />
        <div className="action" onClick={() => setSearch(false)}>
          <Icon name="close" />
        </div>
      </div>

      <ul className="menu-container">
        {navItems.map((item, index) => (
          <li className={getMenuItemClass(item)} key={index} onClick={goPage(item)}>
            {typeof item.icon === 'string' ? <Icon name={item.icon} size={20} /> : item.icon}
            {item.label}
          </li>
        ))}
      </ul>

      <div className="user-actions">
        <div className="search" onClick={() => setSearch(true)}>
          <Icon name="search" />
        </div>

        <NotificationMenu />

        {/* <div className="favorite" onClick={() => router.push('/dashboard/sale')}>
          <Icon name="heart" />
        </div> */}

        <CartMenu />

        {user?.id ? (
          <Menu
            className="login-user-menu"
            maxHeight="fit-content"
            activator={
              <React.Fragment>
                <div
                  className="avatar"
                  style={{
                    backgroundImage: `url('${getFileFullUrl(
                      user.picture
                    )}'), url('/assets/imgs/avatar.webp')`,
                  }}
                ></div>
              </React.Fragment>
            }
            menuItems={[
              {
                label: (
                  <div className="user_info">
                    <div
                      className="avatar"
                      style={{
                        backgroundImage: `url('${getFileFullUrl(
                          user.picture
                        )}'), url('/assets/imgs/avatar.webp')`,
                      }}
                    ></div>
                    <div className="username">
                      <div className="name">{user.username}</div>
                      <div className="balance">
                        {toCurrency(Math.round((user?.balance + user?.gift) * 100) / 100)}
                      </div>
                    </div>
                  </div>
                ),
                action: () => router.push('/dashboard/balance'),
              },
              { divition: true },
              {
                label: (
                  <div className="icon">
                    <Icon name="account-shopping" size={24} />
                    Compras
                  </div>
                ),
                action: () => router.push('/dashboard/order'),
              },
              {
                label: (
                  <div className="icon">
                    <Icon name="nav-tag" size={24} />
                    Ventas
                  </div>
                ),
                action: () => router.push('/dashboard/sale'),
              },
              {
                label: (
                  <div className="icon">
                    <Icon name="user" size={24} />
                    Mi perfil
                  </div>
                ),
                action: () => router.push('/dashboard/profile'),
              },
              { divition: true },
              {
                label: (
                  <div className="icon">
                    <Icon name="logout" size={24} />
                    Cerrar sesión
                  </div>
                ),
                action: () => dispatch(logout()),
              },
            ]}
          ></Menu>
        ) : (
          <div className="login">
            <Button onClick={() => dispatch(openLoginModal(''))}>Ingresar</Button>
          </div>
        )}
      </div>
    </header>
  );
};
