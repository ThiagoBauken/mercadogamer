import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { initUser, openLoginModal, useAppDispatch, useTypedSelector } from '@store';
import { setting } from '@utils';
import { Header } from '@components/header';
import { Footer } from '@ui-shared/components/footer';
import { LoginPage } from '@components/login';
import { SignupPage } from '@components/signup';
import { ResetPassword } from '@components/reset-password';

type Props = {
  full?: boolean;
  authorise?: boolean;
} & ChildrenProps;

export const DynamicLayout: React.FC<Props> = (props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, modal } = useTypedSelector((state) => state.auth);

  useEffect(() => {
    if (
      props.authorise &&
      !user?.id &&
      (!localStorage.getItem(setting.storage.user) ||
        localStorage.getItem(setting.storage.user) === 'null')
    ) {
      dispatch(openLoginModal(router.asPath));
      router.push('/');
    }
  }, [props.authorise, user]);

  const classNames = useMemo(() => {
    const classes = ['mercado-default-layout'];
    props.full && classes.push('full');
    return classes.join(' ');
  }, [props.full]);

  useEffect(() => {
    if (!user) {
      dispatch(initUser());
    }
  }, [user]);

  return props.authorise && !user?.username ? null : (
    <div className={classNames}>
      <Header />
      <div className="content">{props.children}</div>
      <Footer />
      {modal === 'login' && <LoginPage open={true} />}
      {modal === 'signup' && <SignupPage open={true} />}
      {modal === 'reset-password' && <ResetPassword open={true} />}
    </div>
  );
};
