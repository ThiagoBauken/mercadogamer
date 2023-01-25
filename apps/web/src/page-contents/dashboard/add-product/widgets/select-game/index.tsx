import { useState } from 'react';
import { useTypedSelector } from '@store';
import { getFileFullUrl, madeBackgroundImageUrl } from '@utils';
import { Tooltip } from '@widgets/tooltip';
import { OtherSelectGame } from '../other-game-modal';

type Props = {
  value: string;
  onAction: (value: string) => void;
};

export const SelectProductGame: React.FC<Props> = ({ value, onAction }) => {
  const { games } = useTypedSelector((store) => store.game);
  const [state, setState] = useState<{ modal: boolean }>({ modal: false });
  return (
    <div className="select-product-game content">
      <div className="title">¿A qué juego pertenece tu item?</div>
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
          <Tooltip tooltip="Otro juego">
            <div className="content">Otro juego</div>
          </Tooltip>
        </li>
        <li onClick={() => onAction(null)}>
          <Tooltip tooltip="Ningún juego">
            <div className="content">Ningún juego</div>
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
