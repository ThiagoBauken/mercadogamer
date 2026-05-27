// @ts-nocheck - TypeScript compatibility fix
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useTypedSelector } from '@store';
import { getFileFullUrl, madeBackgroundImageUrl } from '@utils';
import { useTranslation } from 'next-i18next';

import { OtherSelectGame } from '../other-game-modal';

type Props = {
  value: string;
  onAction: (value: string) => void;
};


const Tooltip = dynamic(() => import('@widgets/tooltip').then(mod => mod.Tooltip), { ssr: false });

export const SelectProductGame: React.FC<Props> = ({ value, onAction }) => {
  const { t } = useTranslation('dashboard');
  const { games } = useTypedSelector((store) => store.game);
  const [state, setState] = useState<{ modal: boolean }>({ modal: false });
  return (
    <div className="select-product-game content">
      <div className="title">{t('add_product.select_game.title')}</div>
      <ul>
        {games
          .filter((game) => game?.picture)
          .map((game, index) => (
            <li
              key={index}
              onClick={() => onAction(game.id)}
              className={value === game.id ? 'active' : ''}
            >
              <Tooltip tooltip={game.name}>
                <div
                  className="content"
                  style={{
                    backgroundImage: madeBackgroundImageUrl(
                      getFileFullUrl(`games/${game?.id}.webp`),
                      '/assets/imgs/placeholder.png'
                    ),
                  }}
                ></div>
              </Tooltip>
            </li>
          ))}
        <li onClick={() => setState({ ...state, modal: true })}>
          <Tooltip tooltip={t('add_product.select_game.other_game')}>
            <div className="content">{t('add_product.select_game.other_game')}</div>
          </Tooltip>
        </li>
        <li onClick={() => onAction(null)}>
          <Tooltip tooltip={t('add_product.select_game.no_game')}>
            <div className="content">{t('add_product.select_game.no_game')}</div>
          </Tooltip>
        </li>
      </ul>
      {state.modal && (
        <OtherSelectGame
          open={state.modal}
          onAction={onAction}
          onClose={() => setState({ ...state, modal: false })}
        />
      )}
    </div>
  );
};
