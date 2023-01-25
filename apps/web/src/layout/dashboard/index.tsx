import { DefaultLayout } from '@layout/default-layout';
import { useRouter } from 'next/router';
import { navigations } from './nav-items';
import { logout, useAppDispatch } from '@store';
import { Icon } from '@widgets/icon';

export const DashboardLayout: React.FC<ChildrenProps> = (props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const getMenuItemClass = (item: NavItem): string => {
    const classes = ['menu-item'];
    new RegExp(`${item.url}`, 'i').test(router.asPath) && classes.push('active');
    return classes.join(' ');
  };

  const goPage = (item: NavItem) => (): void => {
    router.push(item.url);
  };

  return (
    <DefaultLayout full authorise>
      <div className="dashboard-layout-content">
        <div className="nav-bar">
          {Object.keys(navigations).map((navigation, index) => (
            <ul key={index}>
              <li className="title">{navigation}</li>
              {navigations[navigation].map((nav, navIndex) => (
                <li className={getMenuItemClass(nav)} key={navIndex} onClick={goPage(nav)}>
                  <div className="icon">
                    {typeof nav.icon === 'string' ? <Icon name={nav.icon} size={20} /> : nav.icon}
                  </div>
                  <div className="label">{nav.label}</div>
                </li>
              ))}
            </ul>
          ))}
          <ul className="logout-item">
            <li className="navigation-item" onClick={() => dispatch(logout())}>
              <div className="icon">
                <Icon name="logout" />
              </div>
              <div className="label">Cerrar sesión</div>
            </li>
          </ul>
        </div>
        <div className="content">{props.children}</div>
      </div>
    </DefaultLayout>
  );
};
