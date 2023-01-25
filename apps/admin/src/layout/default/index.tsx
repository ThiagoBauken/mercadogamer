import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AdminHeader } from '@admin/components/header';
import { Footer } from '@ui-shared/components/footer';
import { endpoints, httpGetAll, setting } from '@utils';
import { loginWithToken, logout, useAppDispatch, useTypedSelector } from '@admin/store';
import { COUNTRY } from '@admin/store/types';
import { NavButton } from '../../components/navButton/navButton';

export const AdminLayout: React.FC<ChildrenProps> = ({ children }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    auth: { user },
    county: { countries },
  } = useTypedSelector((store) => store);

  useEffect(() => {
    if (!user || !user.id) {
      if (localStorage.getItem(setting.storage.token)) {
        dispatch(loginWithToken(router));
      } else {
        router.push('/login');
      }
    }
  }, [user]);

  useEffect(() => {
    !countries.length && init();
  }, [countries]);

  const init = async (): Promise<void> => {
    const result = await httpGetAll<CountryModelType>(endpoints.countriesUrl);
    dispatch({ type: COUNTRY.SET_COUNTRY, payload: result.data.data });
  };

  const logOut = async () => {
    await dispatch(logout());
    router.push('/login');
  };

  const links = [
    ['/roullet', 'Ruleta'],
    ['/earnings', 'Ganancias'],
    ['/ventas', 'Ventas'],
    ['/users', 'Usuarios'],
    ['/loads', 'Cargas'],
  ];

  return (
    <div className="mercado-admin-layout">
      <AdminHeader></AdminHeader>
      <div className="main-content">
        <nav>
          <div className="nav-container">
            <div>
              {links.map(([href, text], index) => (
                <NavButton
                  key={index}
                  href={href}
                  text={text}
                  active={router.route === href}
                ></NavButton>
              ))}
            </div>
            <button onClick={logOut}>Cerrar sesión</button>
          </div>
        </nav>
        <div className="page-container">{children}</div>
      </div>
      <Footer></Footer>
    </div>
  );
};
