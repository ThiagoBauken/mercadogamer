import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useOutsideClick } from '@hooks';
import { logout, openLoginModal, useAppDispatch, useTypedSelector } from '@store';
import { getFileFullUrl, toCurrency, httpGetAll, endpoints } from '@utils';

import dynamic from 'next/dynamic';

const CreateTicketModal = dynamic(
  () => import('@web/page-contents/dashboard/support/widgets/create-ticket-modal/index')
);
const CreateFeedbackModal = dynamic(() => import('../create-feedback/index'));

const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

type Props = {
  collapse: boolean;
  onChangeStatus: (collapse: boolean) => void;
};

export const MobileNavigation: React.FC<Props> = (props) => {
  const { t } = useTranslation('common');
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
    selectedTicket: TicketModelType | null;
    showInformation: boolean;
  }>({
    ticketmodal: false,
    feedbackmodal: false,
    tickets: [],
    selectedTicket: null,
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
      console.error('Error loading tickets:', error);
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
      label: t('nav.catalog'),
      url: '/catalogo',
      icon: 'shopping-bag',
      role: 'default',
    },
    {
      label: t('nav.gifts'),
      url: '/regalos',
      icon: 'christmas-mobile-gift', // Christmas header icon
      role: 'default',
    },
    {
      label: t('nav.sell'),
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
      label: t('nav.balance'),
      url: '/dashboard/balance',
      icon: 'account-balance-wallet',
      role: 'loggedin',
    },
    {
      label: t('nav.purchases'),
      url: '/dashboard/order',
      icon: 'shopping-basket',
      role: 'loggedin',
    },
    {
      label: t('nav.my_questions'),
      url: '/dashboard/qas',
      icon: 'help-circle',
      role: 'loggedin',
    },
    {
      label: t('nav.sales'),
      url: '/dashboard/sale',
      icon: 'nav-tag',
      role: 'loggedin',
    },
    {
      label: t('nav.products'),
      url: '/dashboard/inventory',
      icon: 'archive',
      role: 'loggedin',
    },
    {
      label: t('nav.questions'),
      url: '/dashboard/question',
      icon: 'help-circle',
      role: 'loggedin',
    },
    {
      label: t('nav.store'),
      url: '/dashboard/store',
      icon: 'store',
      role: 'loggedin',
    },
    {
      label: t('nav.my_profile'),
      url: '/dashboard/profile',
      icon: 'user',
      role: 'loggedin',
    },
    {
      label: t('nav.support'),
      url: '/dashboard/support',
      icon: 'message-sequare',
      role: 'loggedin',
    },
  ];
  // VENTAS: [
  //   { label: t('nav.sales'); icon: 'heart'; url: '/ventas' },
  //   { label: t('nav.products'); icon: 'archive'; url: '/inventory' },
  //   { label: 'Preguntas'; icon: 'help-circle'; url: '/question' },
  //   { label: t('nav.store'); icon: 'store'; url: '/store' }
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
                <div className="label">{t('nav.logout')}</div>
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
