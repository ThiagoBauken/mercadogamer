import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { openLoginModal, useAppDispatch, useTypedSelector } from '@store';
import { endpoints, get } from '@utils';
import { RouletteRequirementCard } from '..';
import { TwoFactorAuthentication } from '../two-factor-authentication';

const VerificationPhone = dynamic(() => import('../verification-phone/index'));

export const RouletteRequirements: React.FC<{
  onChnageValidated: (validated: boolean) => void;
}> = ({ onChnageValidated }) => {
  const dispatch = useAppDispatch();
  const { user } = useTypedSelector((store) => store.auth);

  const [state, setState] = useState<{
    phoneNumber: string;
    verification: {
      userLogin: boolean;
      phoneNumber: boolean;
    };
    modal: {
      name: string;
    };
  }>({
    phoneNumber: '',
    modal: { name: '' },
    verification: { userLogin: false, phoneNumber: false },
  });

  useEffect(() => {
    onChnageValidated &&
      onChnageValidated(
        (user?.id || state.verification.userLogin) && state.verification.phoneNumber
      );
  }, [user?.id, state.verification.userLogin, state.verification.phoneNumber]);

  const onCloseModal = (): void => setState({ ...state, modal: { name: '' } });

  const onEnterPhone = async (value: string): Promise<void> => {
    try {
      await get(`${endpoints.userUrl}/sendSms/${value}`);
      setState({ ...state, phoneNumber: value, modal: { name: 'confirm-2fa' } });
    } catch (error) {
      console.log(error);
    }
  };

  const onVerification2fa = (): void => {
    setState({
      ...state,
      modal: { name: '' },
      verification: { ...state.verification, phoneNumber: true },
    });
  };

  return (
    <div className="roulette-requirements">
      <div className="title">Requisitos</div>
      <div className="description">
        Para tener acceso a la ruleta, debes cumplir las siguientes condiciones
      </div>
      <div className="content">
        <RouletteRequirementCard
          title="Registrate en Mercado Gamer"
          message="Conseguí tus productos digitales favoritos."
          button="Ingresar"
          icon="user-plus"
          validate={!!user?.id || state.verification.userLogin}
          onAction={() => dispatch(openLoginModal())}
        />

        <RouletteRequirementCard
          title="Agregá tu número"
          message="Enterate de las últimas novedades y ofertas."
          button="Ingresar"
          icon="phone-call"
          onAction={() => setState({ ...state, modal: { name: 'confirm-number' } })}
          validate={state.verification.phoneNumber || user?.verificationSms}
        />

        {/* <RouletteRequirementCard
          title="Seguinos en Instagram"
          message="Enterate de las últimas novedades y ofertas."
          button="Ingresar"
          icon="instagram"
          validate
        /> */}
      </div>

      <VerificationPhone
        open={state.modal.name === 'confirm-number'}
        onClose={onCloseModal}
        onVerification={onEnterPhone}
      />

      <TwoFactorAuthentication
        open={state.modal.name === 'confirm-2fa'}
        onClose={onCloseModal}
        onVerification={onVerification2fa}
        onResend={() => onEnterPhone(state.phoneNumber)}
      />
    </div>
  );
};
