import { useTypedSelector, useAppDispatch } from '@store';
import { Modal } from '@widgets/modal';
import { get, endpoints, copyTextToClipboard, addMessageToToast } from '@utils';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@widgets/icon';
import { Input } from '@widgets/input';
import { Tooltip } from '@widgets/tooltip';
import { useRouter } from 'next/router';

type Props = {
  open: boolean;
  onClose: () => void;
};

const InviteModal: React.FC<Props> = ({ open, onClose }) => {
  const { user } = useTypedSelector((store) => store.auth);

  const [state, setState] = useState<{
    communication: string;
    inviteTransactions: UserModelType[];
  }>({ communication: '', inviteTransactions: [] });

  useEffect(() => {
    if (user) {
      loadRoulleteInviteTransaction();
    }
  }, [user]);

  const router = useRouter();

  let inviteLink;
  if (user) {
    inviteLink = `${process.env.NEXT_PUBLIC_DOMAIN}/rb/${user?.id}`;
  } else {
    inviteLink = '';
  }

  const loadRoulleteInviteTransaction = async (): Promise<void> => {
    try {
      const inviteTransaction = await get(`${endpoints.userUrl}/userReferrals/${user?.id}}`);

      setState({ ...state, inviteTransactions: inviteTransaction.data || [] });
    } catch (error) {
      console.log(error);
    }
  };

  const onCopy = (): void => {
    copyTextToClipboard(inviteLink).then(() => {
      addMessageToToast('¡Éxito copiado!');
    });
  };

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
        // path: `http://twitter.com/share?text=${defaultMessage}`,
        path: `https://twitter.com/intent/tweet?text=¡JUGÁ A LA RULETA Y GANA PLATA GRATIS EN MERCADO GAMER! Usala para comprar o descontar en tus compras de Juegos, Monedas, Skins, Gift Cards y mucho más.  JUGÁ YA:${inviteLink}`,
      },
    ],
    []
  );

  const SendInviteToSoical = async (item): Promise<void> => {
    window.open(item.path);
  };

  return (
    <Modal open={open} width={450} onClose={onClose}>
      <div className="invite-modal">
        <div className="image">
          <Image
            src={'./assets/imgs/ruleta_invite.webp'}
            layout="fixed"
            loading="lazy"
            unoptimized={true}
            width={133.25}
            height={133.25}
            alt="homepage banner"
          />
        </div>
        <div className="title">Invita un amigo</div>
        <div className="content">
          Cuando tu amigo se registre y juegue en la ruleta obtendrás un drop extra.
        </div>
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
                    name={
                      state.communication === item.icon ? `${item.icon}-active` : `${item.icon}`
                    }
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="sm-title"
          onClick={() => router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/help-center/regalos/118`)}
        >
          ¿Cómo funcionan las invitaciones?
        </div>

        <div className="invite-link">
          <Input value={inviteLink} full disabled />
          <div className="clipboard" onClick={onCopy}>
            <Icon name="clipboard" />
          </div>
        </div>

        <div className="users">
          <div className="title">Tus invitaciones</div>
          <div className="content">
            {state.inviteTransactions.length !== 0
              ? state.inviteTransactions.map(
                  (transaction, index) =>
                    transaction && (
                      <div className="user" key={index}>
                        <div className="photo">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_FILE_URL}/${transaction?.picture}`}
                            layout="fixed"
                            loading="lazy"
                            unoptimized={true}
                            width={32}
                            height={32}
                            alt="homepage banner"
                            style={{ borderRadius: 400 / 2 }}
                          />
                        </div>
                        <div className="name">{transaction.username}</div>
                        <div className="status">
                          {transaction.firstRoulettePlay === false &&
                          transaction.referrerUsedTheDrop === false ? (
                            <Tooltip tooltip="Registrado, aún no jugó la ruleta">
                              <Icon name="invite-circle-clock" />
                            </Tooltip>
                          ) : transaction.firstRoulettePlay === true &&
                            transaction.referrerUsedTheDrop === false ? (
                            <Tooltip tooltip="Drop disponible">
                              <Icon name="invite-gift" />
                            </Tooltip>
                          ) : (transaction.referrerUsedTheDrop === true &&
                              transaction.firstRoulettePlay === true) ||
                            (transaction.referrerUsedTheDrop === true &&
                              transaction.firstRoulettePlay === false) ? (
                            <Tooltip tooltip="Usaste este drop">
                              <Icon name="invite-circle-check" />
                            </Tooltip>
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                    )
                )
              : 'Aún no tienes invitados'}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InviteModal;
