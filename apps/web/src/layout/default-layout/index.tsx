import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { initUser, openLoginModal, useAppDispatch, useTypedSelector } from '@store';
import { setting } from '@utils';
import { Header } from '@components/header';
import { Footer } from '@ui-shared/components/footer';
import { LoginPage } from '@components/login';
import { SignupPage } from '@components/signup';
import { ResetPassword } from '@components/reset-password';

interface ChildrenProps {
  children: React.ReactNode;
}

type Props = {
  full?: boolean;
  authorise?: boolean;
} & ChildrenProps;

export const DefaultLayout: React.FC<Props> = (props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, modal } = useTypedSelector((state) => state.auth);
  // mounted = true após primeira render do client. SSR sempre vê false.
  // Usamos isso pra evitar hydration mismatch quando lemos localStorage.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!user) dispatch(initUser());
  }, [dispatch, user]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!props.authorise) return;
    // Só redireciona se REALMENTE não há credencial em lugar nenhum:
    // - user no Redux: vazio
    // - user no localStorage: vazio
    if (!user?.id) {
      const lsUser = localStorage.getItem(setting.storage.user);
      const lsIsEmpty = !lsUser || lsUser === 'null' || lsUser === 'undefined';
      if (lsIsEmpty) {
        dispatch(openLoginModal(router.asPath));
        router.push('/');
      }
    }
  }, [props.authorise, user, router, dispatch]);

  const classNames = useMemo(() => {
    const classes = ['content'];
    props.full && classes.push('full');
    return classes.join(' ');
  }, [props.full]);

  // Antes do mount no client (durante SSR), renderiza otimisticamente
  // assumindo que tudo funciona. Só após mount (e com localStorage acessível)
  // que decidimos esconder/redirecionar baseado em auth.
  const hasUserInLS =
    mounted &&
    !!localStorage.getItem(setting.storage.user) &&
    localStorage.getItem(setting.storage.user) !== 'null' &&
    localStorage.getItem(setting.storage.user) !== 'undefined';

  // Só esconde DEPOIS de montado E confirmou que não tem credenciais em lugar nenhum
  if (mounted && props.authorise && !user?.username && !hasUserInLS) return null;

  return (
    <div className="mercado-default-layout">
      <Header />
      <div className={classNames}>{props.children}</div>
      <Footer />
      {modal === 'login' && <LoginPage open={true} />}
      {modal === 'signup' && <SignupPage open={true} />}
      {modal === 'reset-password' && <ResetPassword open={true} />}
    </div>
  );
};
