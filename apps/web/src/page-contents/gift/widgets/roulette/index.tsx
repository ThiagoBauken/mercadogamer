import React, { useEffect, useMemo, useRef, useState } from 'react';
import { caculateTime, endpoints, formatInteger, get, madeBackgroundImageUrl } from '@utils';
import { RouletteKind } from '../../constanst';
import moment from 'moment';
import { useWindowSize } from '@hooks';
import {
  getRouletteTransaction,
  openSignupModal,
  reloadUser,
  useAppDispatch,
  useTypedSelector,
} from '@store';
import { Button } from '@widgets/button';
import { Modal } from '@widgets/modal';
import { Icon } from '@widgets/icon';
import { ROULETTE } from '@web/store/types';
import InviteModal from '@web/components/invite-modal';

type RouletteItemType = {
  label?: string;
  image?: string;
  color?: string;
  type?: number;
  value?: number;
};

let rateInterval;

export const Roulette: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const dispatch = useAppDispatch();
  const {
    auth: { user },
    roulette,
  } = useTypedSelector((store) => store);

  const [state, setState] = useState<{
    position: number;
    selectedItem: number;
    modal: boolean;
    possibleTime: number;
    invite: { name: 'user-invite' };
    communication: string;
  }>({
    position: 0,
    selectedItem: 0,
    modal: false,
    possibleTime: 0,
    invite: null,
    communication: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [canclick, setCanClick] = useState<boolean>(true);

  const [remain, setRemain] = useState<{
    days: number;
    hours: number;
    minuts: number;
    seconds: number;
  }>({ days: 0, hours: 0, minuts: 0, seconds: 0 });

  const { width } = useWindowSize();

  const rouletteContentRef = useRef<HTMLDivElement>(null);
  const requirementsRef = useRef<HTMLDivElement>(undefined);

  const items = useMemo<RouletteItemType[]>(() => {
    const types = [2, 2, 6, 2, 5, 4, 0, 4];
    const result = RouletteKind.map((roulette, index) => ({
      ...roulette,
      type: types[index],
    }));
    return result;
  }, []);

  useEffect(() => {
    if (user?.id) dispatch(getRouletteTransaction());
    else {
      dispatch({ type: ROULETTE.HISTORY, payload: [] });
      setState({
        position: 0,
        selectedItem: 0,
        modal: false,
        possibleTime: 0,
        invite: null,
        communication: '',
      });
    }
  }, [user?.id]);

  useEffect(() => {
    setLoading(false);
  }, []);

  const canPlay = useMemo<boolean>(() => {
    if (Array.isArray(roulette.history?.data) && user?.id) {
      const today = moment().format('MM/DD/YYYY');
      const transaction = roulette.history.data.find(
        (history) =>
          history.userId?.id === user.id && moment(history.createdAt).format('MM/DD/YYYY') === today
      );
      if (transaction) {
        setState({ ...state, possibleTime: moment(transaction.createdAt).add(1, 'day').valueOf() });
        return false;
      } else {
        setState({ ...state, possibleTime: 0 });
        return true;
      }
    }
    return false;
  }, [user?.id, roulette.history]);

  const extendedItems = useMemo<RouletteItemType[]>(() => {
    let result = [];
    Array.from(Array(10).keys()).forEach(() => {
      result = result.concat(items);
    });
    return result;
  }, [items]);

  const onPlay = async (): Promise<void> => {
    setCanClick(false);
    setTimeout(() => {
      setCanClick(true);
    }, 3500);

    if (!user) {
      dispatch(openSignupModal());
      return;
    }

    if (!user?.verificationSms) {
      if (requirementsRef.current) {
        requirementsRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
      return;
    }

    try {
      const response = await get(`${endpoints.rouletteUrl}/getAmount`);
      const selectedItem = Object.keys(RouletteKind).findIndex(
        (key) => RouletteKind[key].value === response.data
      );

      const cardWidth = width > 992 ? 120 : 66;
      const cardGap = width > 992 ? 10 : 5;
      const position =
        Math.min(Math.random(), 0.85) * cardWidth +
        ((cardWidth + cardGap) * (items.length * 8 + selectedItem) - cardGap / 2) -
        rouletteContentRef.current.offsetWidth / 2;

      setState({ ...state, position: 0 });
      dispatch(getRouletteTransaction());
      dispatch(reloadUser());
      setTimeout(() => {
        setState({
          ...state,
          position: -position,
          selectedItem,
          possibleTime: moment().add(1, 'day').valueOf(),
        });
      }, 100);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const item = items[state.selectedItem];
    state.position &&
      item &&
      setTimeout(() => {
        setState({ ...state, modal: true, possibleTime: moment().add(1, 'day').valueOf() });
      }, 3000);
  }, [state.position]);

  useEffect(() => {
    if (state.possibleTime) {
      clearInterval(rateInterval);
      rateInterval = setInterval(() => {
        setRemain(caculateTime(state.possibleTime - moment().valueOf()));
      }, 1000);
    }
  }, [state.possibleTime]);

  const selectedItem = useMemo<RouletteItemType>(
    () => items[state.selectedItem] || {},
    [state.selectedItem]
  );

  let inviteLink;
  if (user) {
    inviteLink = `${process.env.NEXT_PUBLIC_DOMAIN}/rb/${user?.id}`;
  } else {
    inviteLink = '';
  }

  let defaultMessage = `¡JUGÁ A LA RULETA Y GANA PLATA GRATIS EN MERCADO GAMER! Usala para comprar o descontar en tus compras de Juegos, Monedas, Skins, Gift Cards y mucho más.  JUGÁ YA: ${inviteLink}`;

  const communications = useMemo<{ icon: string; path: string }[]>(
    () => [
      {
        icon: 'facebook',
        path: `https://www.facebook.com/share.php?u=${inviteLink}`,
      },
      {
        icon: 'whatsapp',
        path: `https://wa.me/?text=${defaultMessage}`,
      },
      {
        icon: 'twitter',
        path: `http://twitter.com/share?text=${defaultMessage}`,
      },
    ],
    []
  );

  const SendInviteToSoical = async (item): Promise<void> => {
    window.open(item.path);
  };

  return (
    <div className="roulette-container">
      <div className="roulette-spiner" ref={rouletteContentRef}>
        <div className="indicator">
          <div className="line"></div>
        </div>
        <ul
          className="roulette"
          style={{
            transform: `translateX(${state.position}px)`,
            transitionDuration: state.position ? '2.5s' : '0s',
          }}
        >
          {extendedItems.map((item, index) => (
            <li
              key={index}
              className={`roulette-card${item.type ? ` type-${item.type}` : ''}`}
              style={{ color: item.color }}
            >
              <div className="card-content">
                <div
                  className="image-container"
                  style={{ backgroundImage: madeBackgroundImageUrl(item.image) }}
                ></div>
                <div className="label">{item.label}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="action">
        <div className="group">
          <Button
            onClick={onPlay}
            width={200}
            kind={state.possibleTime && user?.extraRouletteDrop === 0 ? 'secondary' : 'primary'}
            loading={loading}
            disabled={
              ((!canPlay || !isPlaying || !!state.possibleTime) &&
                (!!state.possibleTime || !user?.verificationSms) &&
                user &&
                user.extraRouletteDrop === 0) ||
              !canclick
            }
          >
            {state.possibleTime && user?.extraRouletteDrop === 0
              ? `Disponible en ${formatInteger(remain.hours)}:${formatInteger(
                  remain.minuts
                )}:${formatInteger(remain.seconds)}`
              : user?.extraRouletteDrop > 0 && state.possibleTime
              ? `Usar drop (${user?.extraRouletteDrop})`
              : `Jugar`}
          </Button>
          <Button
            width={200}
            kind={'secondary'}
            loading={loading}
            disabled={!user}
            onClick={() => setState({ ...state, invite: { name: 'user-invite' } })}
          >
            Invita un amigo
          </Button>
        </div>
        <div className="invite">Invita a tus amigos para conseguir drops extra.</div>
        <div className="description">
          Al jugar la ruleta aceptas las Condiciones de uso y los términos de Provably Fair.
        </div>
      </div>

      {/* This is a mocked div used to scroll to the requirements to play the roulette */}
      <div
        style={{ visibility: 'hidden', margin: '0', padding: '0', height: '1px' }}
        ref={requirementsRef}
      ></div>

      <Modal
        open={state.modal}
        width={450}
        contentClass="roulette-confirm-modal"
        onClose={() => setState({ ...state, modal: false })}
      >
        {selectedItem.value >= 500 && (
          <div className="background">
            <Icon name="light-effect" size="334px" color={selectedItem.color} />
          </div>
        )}

        <div className="title">
          {selectedItem.value === 0
            ? 'Nada por aquí :('
            : selectedItem.value < 500
            ? '¡Ganaste!'
            : '¡Increíble!'}
        </div>
        {selectedItem.value >= 500 ? (
          <div className="content">Ganaste un premio especial.</div>
        ) : null}
        <div
          className="image-container"
          style={{ backgroundImage: madeBackgroundImageUrl(selectedItem.image) }}
        ></div>
        <div
          className="value"
          style={{ color: selectedItem.value >= 500 ? selectedItem.color : 'currentcolor' }}
        >
          {selectedItem.label}
        </div>
        {selectedItem.value == 0 && <div className="description">No tuviste suerte esta vez.</div>}
        {selectedItem.value >= 500 ? (
          <React.Fragment>
            <div className="shared-message">Compartilo con tus amigos</div>
            <div className="communication">
              <ul>
                {communications.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => SendInviteToSoical(item)}
                    onMouseOver={() => setState({ ...state, communication: item.icon })}
                    onMouseOut={() => setState({ ...state, communication: '' })}
                  >
                    <div className="icon">
                      <Icon
                        name={state.communication === item.icon ? `${item.icon}-active` : item.icon}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="confirm-action" onClick={() => setState({ ...state, modal: false })}>
              Continuar
            </div>
          </React.Fragment>
        ) : (
          <Button full onClick={() => setState({ ...state, modal: false })}>
            Continuar
          </Button>
        )}
      </Modal>

      {state.invite?.name === 'user-invite' && (
        <InviteModal open={true} onClose={() => setState({ ...state, invite: null })} />
      )}
    </div>
  );
};
