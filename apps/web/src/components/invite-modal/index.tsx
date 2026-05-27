import { useTypedSelector, useAppDispatch } from '@store';

import { get, endpoints, copyTextToClipboard, addMessageToToast } from '@utils';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';



import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';


const Modal = dynamic(() => import('@widgets/modal').then(mod => mod.Modal), { ssr: false });

const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

const Input = dynamic(() => import('@widgets/input').then(mod => mod.Input), { ssr: false });

const Tooltip = dynamic(() => import('@widgets/tooltip').then(mod => mod.Tooltip), { ssr: false });

type Props = {
  open: boolean;
  onClose: () => void;
};

const InviteModal: React.FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation('common');
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
      console.error('Error loading invite transactions:', error);
    }
  };

  const onCopy = (): void => {
    copyTextToClipboard(inviteLink).then(() => {
      addMessageToToast(t('modals.invite.copy_success'));
    });
  };

  let defaultMessage = `${t('modals.invite.share_message')} ${inviteLink}`;
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
        path: `https://twitter.com/intent/tweet?text=${t('modals.invite.share_message')}${inviteLink}`,
      },
    ],
    [inviteLink, defaultMessage, t]
  );

  const SendInviteToSoical = async (item: { icon: string; path: string }): Promise<void> => {
    window.open(item.path);
  };

  return (
    <Modal open={open} width={450} onClose={onClose}>
      <div className="invite-modal">
        <div className="image">
          <Image
            src={'./assets/imgs/ruleta_invite.webp'}
            width={133.25}
            height={133.25}
            alt="invite banner"
          />
        </div>
        <div className="title">{t('modals.invite.title')}</div>
        <div className="content">
          {t('modals.invite.description')}
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
          {t('modals.invite.how_it_works')}
        </div>

        <div className="invite-link">
          <Input value={inviteLink} full disabled />
          <div className="clipboard" onClick={onCopy}>
            <Icon name="clipboard" />
          </div>
        </div>

        <div className="users">
          <div className="title">{t('modals.invite.your_invites')}</div>
          <div className="content">
            {state.inviteTransactions.length !== 0
              ? state.inviteTransactions.map(
                  (transaction, index) =>
                    transaction && (
                      <div className="user" key={index}>
                        <div className="photo">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_FILE_URL}/${transaction?.picture}`}
                            width={32}
                            height={32}
                            alt="user avatar"
                            style={{ borderRadius: 400 / 2 }}
                          />
                        </div>
                        <div className="name">{transaction.username}</div>
                        <div className="status">
                          {transaction.firstRoulettePlay === false &&
                          transaction.referrerUsedTheDrop === false ? (
                            <Tooltip tooltip={t('modals.invite.status.registered')}>
                              <Icon name="invite-circle-clock" />
                            </Tooltip>
                          ) : transaction.firstRoulettePlay === true &&
                            transaction.referrerUsedTheDrop === false ? (
                            <Tooltip tooltip={t('modals.invite.status.available')}>
                              <Icon name="invite-gift" />
                            </Tooltip>
                          ) : (transaction.referrerUsedTheDrop === true &&
                              transaction.firstRoulettePlay === true) ||
                            (transaction.referrerUsedTheDrop === true &&
                              transaction.firstRoulettePlay === false) ? (
                            <Tooltip tooltip={t('modals.invite.status.used')}>
                              <Icon name="invite-circle-check" />
                            </Tooltip>
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                    )
                )
              : t('modals.invite.no_invites')}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InviteModal;
