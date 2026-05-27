// @ts-nocheck - TypeScript compatibility fix
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import { Roulette, RouletteHistory, RouletteRequirements } from './widgets';


import { ShortCutMenu } from '@web/components/shortcut-menu';
import { useRouter } from 'next/router';
import { setting } from '@utils';
import { openSignupModal, useAppDispatch, useTypedSelector } from '@web/store';
import { REFERREDBY } from '@web/store/types';


const Loading = dynamic(() => import('@widgets/loading').then(mod => mod.Loading), { ssr: false });

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

export const RuletaContent: React.FC = () => {
  const [state, setState] = useState<{ isPlaying: boolean }>({ isPlaying: false });
  const [activeShortcut, setShowShortcut] = useState(false);

  const dispatch = useAppDispatch();

  const router = useRouter();

  const {
    auth: { user },
  } = useTypedSelector((store) => store);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localuser = JSON.parse(localStorage.getItem(setting.storage.user));
      if (router.query?.rb && !localuser && !user) {
        init(router.query?.rb as string);
      } else {
        if (Object.keys(router.query).length > 0) router.push('/regalos');
      }
    }
  }, [router.query]);

  const init = async (id: string): Promise<void> => {
    await dispatch({ type: REFERREDBY.SET_REFERREDBY, payload: id });
    dispatch(openSignupModal());
  };

  return (
    <section className="gift-page">
      {/* <Loading loading={loading} /> */}
      <div className="gift-page-header">
        <div className="gift-page-title">
          <div className="title">Ruleta de regalos</div>
          <div className="sm-title">
            Obtén balance gratis y cupones de descuento todos los días.
          </div>
        </div>
      </div>

      <div className="content">
        <Roulette isPlaying={state.isPlaying} />

        <RouletteRequirements
          onChnageValidated={(value) => setState({ ...state, isPlaying: value })}
        />

        <RouletteHistory />
      </div>

      <div className="shortcut-action">
        {activeShortcut === false ? (
          <Button className="action" onClick={() => setShowShortcut(true)}>
            <Icon name="help-circle" />
          </Button>
        ) : (
          <Button className="action" onClick={() => setShowShortcut(false)}>
            <Icon name="close" />
          </Button>
        )}
        {activeShortcut === true && (
          <div className="stortcut-content">
            <ShortCutMenu />
          </div>
        )}
      </div>
    </section>
  );
};
