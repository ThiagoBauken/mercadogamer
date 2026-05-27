import { useEffect, useMemo } from 'react';
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

  useEffect(() => {
    // Check authorization only on client-side to avoid SSR issues
    if (typeof window === 'undefined') return;

    if (
      props.authorise &&
      !user?.id &&
      (!localStorage.getItem(setting.storage.user) ||
        localStorage.getItem(setting.storage.user) === 'null')
    ) {
      dispatch(openLoginModal(router.asPath));
      router.push('/');
    }
  }, [props.authorise, user, router, dispatch]);
  // default content className setting
  const classNames = useMemo(() => {
    const classes = ['content'];
    props.full && classes.push('full');
    return classes.join(' ');
  }, [props.full]);

  useEffect(() => {
    if (!user) {
      dispatch(initUser());
    }
  }, [user, dispatch]);

  return props.authorise && !user?.username ? null : (
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
