import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useOutsideClick } from '@hooks';
import { logout, openLoginModal, useAppDispatch, useTypedSelector } from '@store';
import { getFileFullUrl, toCurrency, httpGetAll, endpoints } from '@utils';
import { Icon } from '@widgets/icon';
import { Button } from '@widgets/button';
import dynamic from 'next/dynamic';

const CreateTicketModal = dynamic(
  () => import('@web/page-contents/dashboard/support/widgets/create-ticket-modal/index')
);
const CreateFeedbackModal = dynamic(() => import('../create-feedback/index'));

type Props = {
  collapse: boolean;
  onChangeStatus: (collapse: boolean) => void;
};
export const MobileNavigation: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const { user } = useTypedSelector((store) => store.auth);
  const { collapse } = props;
  const router = useRouter();
  const ref = useRef<HTMLElement>(null);
  useOutsideClick(ref, () => props.onChangeStatus(false));

  const [state, setState] = useState<{
    ticketmodal: boolean;
    feedbackmodal: boolean;
    tickets: TicketModelType[];
    selectedTicket: TicketModelType;
    showInformation: boolean;
  }>({
    ticketmodal: null,
    feedbackmodal: null,
    tickets: [],
    selectedTicket: {},
    showInformation: false,
  });

  useEffect(() => {
    user?.id && loadTickets();
  }, [user?.id]);

  const loadTickets = async (): Promise<void> => {
    try {
      const response = await httpGetAll<TicketModelType>(endpoints.ticketUrl, {
        filter: { user: user.id },
        sort: { updatedAt: -1 },
      });
      setState({ ...state, tickets: response.data?.data, ticketmodal: false });
    } catch (error) {
      console.log(error);
    }
  };

  const classNames = useMemo<string>(() => {
    const classes = ['mobile-navigation'];
    user?.id && classes.push('login');
    collapse && classes.push('active');
    return classes.join(' ');
  }, [collapse, user]);

  const onClick = (navigation: NavItem): void => {
    router.push(navigation.url);
  };

  const renderNavItem = (nav: NavItem, index: number): React.ReactNode => (
    <li className="navigation-item" key={index} onClick={() => onClick(nav)}>
      <div className="icon">
        <Icon name={`${nav.icon}`} />
      </div>
      <div className="label">{nav.label}</div>
    </li>
  );

  const navigations: NavItem[] = [
    {
      label: 'Catálogo',
      url: '/catalogo',
      icon: 'shopping-bag',
      role: 'default',
    },
    {
      label: 'Regalos',
      url: '/regalos',
      icon: 'christmas-mobile-gift', // Christmas header icon
      role: 'default',
    },
    {
      label: 'Vender',
      // url: `${
      //   user ? (user?.hasFirstVisitVendor ? '/dashboard/inventory/add' : '/vendor-landing') : ''
      // }`,
      url: user?.hasFirstVisitVendor ? '/dashboard/inventory/add' : '/vendedores',
      icon: 'dollar-circle',
      role: 'default',
    },
    // {
    //   label: 'Favoritos',
    //   url: '/cart',
    //   icon: 'heart',
    //   role: 'loggedin',
    // },

    {
      label: 'Balance',
      url: '/dashboard/balance',
      icon: 'account-balance-wallet',
      role: 'loggedin',
    },
    {
      label: 'Compras',
      url: '/dashboard/order',
      icon: 'shopping-basket',
      role: 'loggedin',
    },
    {
      label: 'Mis preguntas',
      url: '/dashboard/qas',
      icon: 'help-circle',
      role: 'loggedin',
    },
    {
      label: 'Ventas',
      url: '/dashboard/sale',
      icon: 'nav-tag',
      role: 'loggedin',
    },
    {
      label: 'Productos',
      url: '/dashboard/inventory',
      icon: 'archive',
      role: 'loggedin',
    },
    {
      label: 'Consultas',
      url: '/dashboard/question',
      icon: 'help-circle',
      role: 'loggedin',
    },
    {
      label: 'Tienda',
      url: '/dashboard/store',
      icon: 'store',
      role: 'loggedin',
    },
    {
      label: 'Mi perfil',
      url: '/dashboard/profile',
      icon: 'user',
      role: 'loggedin',
    },
    {
      label: 'Soporte',
      url: '/dashboard/support',
      icon: 'message-sequare',
      role: 'loggedin',
    },
  ];
  // VENTAS: [
  //   { label: 'Ventas'; icon: 'heart'; url: '/ventas' },
  //   { label: 'Productos'; icon: 'archive'; url: '/inventory' },
  //   { label: 'Preguntas'; icon: 'help-circle'; url: '/question' },
  //   { label: 'Tienda'; icon: 'store'; url: '/store' }
  // ];

  return (
    <Fragment>
      <aside className={classNames} ref={ref}>
        <div className="header">
          <div className="logo" onClick={() => router.push('/')}>
            <Icon name="logo" />
          </div>
          <div
            className="action"
            onClick={() => props.onChangeStatus && props.onChangeStatus(!collapse)}
          >
            <Icon name="close" />
          </div>
        </div>
        <div className="content">
          {user?.id && (
            <div className="user-avatar">
              <div
                className="avatar"
                style={{
                  backgroundImage: `url('${getFileFullUrl(
                    user.picture
                  )}'), url('/assets/imgs/avatar.webp')`,
                }}
              ></div>
              <div className="user-info">
                <div className="name">{`${user.username}`}</div>
                <div className="balance">
                  {toCurrency(Math.round((user?.balance + user?.gift) * 100) / 100)}
                </div>
              </div>
            </div>
          )}

          <div className="mobile-shortcut-menu">
            <div className="menu-item" onClick={() => router.push('/help-center')}>
              <Icon name="help-circle" />
              Centro de ayuda
            </div>
            <div
              className="menu-item"
              onClick={() =>
                user?.id ? setState({ ...state, feedbackmodal: true }) : dispatch(openLoginModal())
              }
            >
              <Icon name="mail" />
              Enviar feedback
            </div>
            <div
              className="menu-item"
              onClick={() =>
                user?.id ? setState({ ...state, ticketmodal: true }) : dispatch(openLoginModal())
              }
            >
              <Icon name="message-sequare" />
              Enviar consulta
            </div>
          </div>

          <ul>{navigations.filter((item) => item.role === 'default').map(renderNavItem)}</ul>

          {user?.id && (
            <ul>{navigations.filter((item) => item.role === 'loggedin').map(renderNavItem)}</ul>
          )}
        </div>

        <div className="action">
          {!user?.id ? (
            <Button full onClick={() => dispatch(openLoginModal())}>
              Ingresar
            </Button>
          ) : (
            <ul>
              <li className="navigation-item" onClick={() => dispatch(logout())}>
                <div className="icon">
                  <Icon name="logout" />
                </div>
                <div className="label">Cerrar sesión</div>
              </li>
            </ul>
          )}
        </div>
      </aside>
      {state.ticketmodal && (
        <CreateTicketModal
          open={true}
          onClose={() => setState({ ...state, ticketmodal: false })}
          onAction={loadTickets}
        />
      )}
      {state.feedbackmodal && (
        <CreateFeedbackModal
          open={true}
          onClose={() => setState({ ...state, feedbackmodal: false })}
        />
      )}
    </Fragment>
  );
};
